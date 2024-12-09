import {Injectable, signal} from '@angular/core';
import {LoginUserGQL, LoginUserQuery, RegisterUserGQL, User, UserMutationResponse} from '../graphql/generated';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {HttpStatusCode} from '@angular/common/http';
import {Observable, of} from 'rxjs';

class ConflictError implements Error {
  constructor(message: string) {
    this.message = message;
  }

  message: string;
  name = 'ConflictException';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'token_Data';
  private readonly USER_DATA_KEY = 'USER_Data';
  private authSingal = signal(false);

  constructor(private loginGQL: LoginUserGQL,
              private registerGQL: RegisterUserGQL,
              private router: Router) {
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
        if (data.success) {
          this.setUserSession(data.token);
        } else {

        }
    })
    return loginTokenQuery as Observable<LoginUserQuery>
  }

  private setUserSession(userId: string) {

    this.setStorageItem(this.TOKEN_KEY, userId);
    this.authSingal.set(true);
    this.router.navigate(['/']);
  }

  private setStorageItem(key: string, value: string): void {
    localStorage.setItem(key, value);
    sessionStorage.setItem(key, value);
  }

  private removeStorageItem(key: string): void {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }

  isLoggedIn(): boolean {
    var authToken = this.getToken();
    return !!authToken;
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY) || localStorage.getItem(this.TOKEN_KEY);
  }

  logout(): void {
    this.removeStorageItem(this.TOKEN_KEY);
    this.removeStorageItem(this.USER_DATA_KEY);
    sessionStorage.clear();
    this.router.navigate(['/']);
    this.authSingal.set(false);

  }


  getAuthSignal() {
    return this.authSingal;
  }
}
