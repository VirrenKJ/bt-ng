import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/authentication/services/login.service';

@Injectable({
  providedIn: 'root',
})
export class ViewerGuard implements CanActivate {
  constructor(private loginService: LoginService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.loginService.getUserRole() == 'Viewer') {
      this.router.navigate(['/bug-tracker/view-issue']);
      return false;
    } else {
      return true;
    }
  }
}
