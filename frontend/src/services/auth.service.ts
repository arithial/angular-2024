import {computed, Injectable, signal, WritableSignal} from '@angular/core';
import {
  GetCurrentUserGQL, LoginResponse,
  LoginUserGQL,
  RegisterUserGQL, User,
  UserMutationResponse
} from '../graphql/generated';
import {map} from 'rxjs/operators';
import {HttpStatusCode} from '@angular/common/http';
import {firstValueFrom, Observable} from 'rxjs';

class ConflictError implements Error {
  constructor(message: string) {
    this.message = message;
  }

  message: string;
  name = 'ConflictException';
}

export const authSignal = signal(false);

export const AUTH_TOKEN_KEY = 'AUTH_TOKEN_KEY';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly USER_DATA_KEY = 'USER_Data';


  constructor(private loginGQL: LoginUserGQL,
              private registerGQL: RegisterUserGQL,
              private getUserGQL: GetCurrentUserGQL) {
  }


  private createUser(username: string, email: string, password: string) {
    var registerQuery = this.registerGQL.mutate({
      user: {
        username: username,
        email: email,
        password: password
      }
    }).pipe(map(result => result.data?.register));
    registerQuery.subscribe(
      (data) => {
        if (data)
          if (data.success) {
            this.setUserSession(data.user.id);
            this.setStorageItem(this.USER_DATA_KEY, JSON.stringify(data.user));
          } else if (data.code == HttpStatusCode.Conflict.valueOf()) {
            throw new ConflictError(data.message);
          } else {

          }
      }
    );
    return registerQuery as Observable<UserMutationResponse>;
  }

  login(username: string, password: string) {
    var loginTokenQuery = this.loginGQL.fetch({
      password: password,
      username: username
    }).pipe(map(result => result.data?.loginToken));
    loginTokenQuery.subscribe(data => {
      if (data)
        if (data.success && data.token) {
          this.setUserSession(data.token);
        } else {

        }
    })
    return loginTokenQuery as Observable<LoginResponse>
  }

  private setUserSession(userId: string) {

    this.setStorageItem(AUTH_TOKEN_KEY, userId);
    this.currentUserPromise().then(result => {
      this.setStorageItem(this.USER_DATA_KEY, JSON.stringify(result));
      authSignal.set(true);
    })
  }

  private setStorageItem(key: string, value: string): void {
    sessionStorage.setItem(key, value);
  }

  private removeStorageItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  isLoggedIn(): boolean {
    var authToken = this.getToken();
    var output = !!authToken;
    authSignal.set(output);
    return output;
  }

  getToken(): string | null {
    return sessionStorage.getItem(AUTH_TOKEN_KEY);
  }

  logout(): void {
    this.removeStorageItem(AUTH_TOKEN_KEY);
    this.removeStorageItem(this.USER_DATA_KEY);
    sessionStorage.clear();
    authSignal.set(false);
  }

  private currentUserPromise() {
    var result = this.getUserGQL.fetch().pipe(map(result => result.data.currentUser));
    return firstValueFrom(result as Observable<User>);
  }

  currentUser() {
    var userData = sessionStorage.getItem(this.USER_DATA_KEY);
    if(userData) {
       return JSON.parse(userData) as User
    }
    return null;
  }
}
