import {CanActivate, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {AuthService} from '../services/auth.service';
;

@Injectable({
  providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {

  constructor(private router: Router,
              private authService: AuthService) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      return false;
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class GuestOnlyGuard implements CanActivate {

  constructor(private router: Router,
              private authService: AuthService) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return false;
    } else {
      return true;
    }
  }
}

