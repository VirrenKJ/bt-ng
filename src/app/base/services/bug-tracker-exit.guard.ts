import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CompanyService } from 'src/app/company-listing/services/company.service';

@Injectable({
  providedIn: 'root',
})
export class BugTrackerExitGuard implements CanActivate {
  constructor(private companyService: CompanyService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.companyService.getTenant() != null && this.companyService.getTenant() != '') {
      this.router.navigate(['/bug-tracker']);
      return false;
    } else {
      return true;
    }
  }
}
