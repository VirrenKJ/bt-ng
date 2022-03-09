import { User } from './../../authentication/common/models/user';
import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { LoginService } from '../../authentication/services/login.service';
import { CompanyService } from 'src/app/company-listing/services/company.service';
import { Company } from 'src/app/company-listing/models/company';

@Component({
	selector: 'app-main-nav',
	templateUrl: './main-nav.component.html',
	styleUrls: ['./main-nav.component.css'],
})
export class MainNavComponent implements OnInit {
	userRole: string = 'Viewer';
	user = new User();
	company: Company;

	isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
		map(result => result.matches),
		shareReplay()
	);

	constructor(private breakpointObserver: BreakpointObserver, private loginService: LoginService, private companyService: CompanyService) {}

	ngOnInit() {
		this.getUser();
		this.getCompany();
	}

	getCompany() {
		this.company = this.companyService.getCompany();
	}

	getUser() {
		setTimeout(() => {
			this.user = this.loginService.getUser();
			this.userRole = this.user?.roles[0]?.roleName;
		});
	}
}
