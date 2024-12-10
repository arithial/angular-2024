import {Injectable, signal} from '@angular/core';
import {
  GetCurrentUserGQL,
  LoginResponse,
  LoginUserGQL,
  RegisterUserGQL,
  User,
  UserMutationResponse
} from '../graphql/generated';
import {map} from 'rxjs/operators';
import {HttpStatusCode} from '@angular/common/http';
import {firstValueFrom, Observable, pipe, take} from 'rxjs';

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
    console.log("init service")
    authSignal.set(this.isLoggedIn());
  }


  createUser(username: string, email: string, password: string) {
    let registerQuery = this.registerGQL.mutate({
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
    let loginTokenQuery = this.loginGQL.fetch({
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
    this.currentUserObservable().subscribe(result => {
      let userData: UserInfo = {
        id: result.id,
        username: result.username,
        email: result.email,
        isAdmin: result.isAdmin === true,
        isGuest: false
      }
      this.setStorageItem(this.USER_DATA_KEY, JSON.stringify(userData));
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
    let authToken = this.getToken();
    return !!authToken;
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

  private currentUserObservable() {
    let result = this.getUserGQL.fetch().pipe(map(result => result.data.currentUser)).pipe(take(1));
    return result as Observable<User>;
  }

  currentUser() {
    let userData = sessionStorage.getItem(this.USER_DATA_KEY);
    if (userData) {
      return JSON.parse(userData) as UserInfo
    }
    return GUEST_USER;
  }
}

export interface UserInfo {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  isGuest: boolean;
}

export const GUEST_USER: UserInfo = {
  id: "",
  username: "",
  email: "",
  isAdmin: false,
  isGuest: true
}
