import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CompanyService } from 'src/app/company-listing/services/company.service';
import Swal from 'sweetalert2';
import { LoginService } from '../../authentication/services/login.service';

@Component({
	selector: 'app-toolbar',
	templateUrl: './toolbar.component.html',
	styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent implements OnInit {
	nameOfUser: string = '';

	constructor(
		private loginService: LoginService,
		private router: Router,
		private ngxService: NgxUiLoaderService,
		private companyService: CompanyService
	) {}

	ngOnInit(): void {
		setTimeout(() => {
			this.afterLogin();
		});
	}

	afterLogin() {
		this.nameOfUser = this.loginService.getUser()?.firstName;
	}

	exitBugTracker() {
		Swal.fire({
			title: 'Are you sure?',
			text: 'You will be redirected to Company Listings!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Exit',
		}).then(result => {
			if (result.isConfirmed) {
				this.companyService.exitBugTracker();
				this.router.navigate(['companies']);
			}
		});
	}

	logout() {
		Swal.fire({
			title: 'Are you sure?',
			text: 'You will be logged out!',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Log out',
		}).then(result => {
			if (result.isConfirmed) {
				this.ngxService.startLoader('master');
				this.loginService.logout();
				this.companyService.exitBugTracker();
				this.router.navigate(['user/login']);
				this.ngxService.stopLoader('master');
			}
		});
	}
}
