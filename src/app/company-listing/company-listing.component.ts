import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import Swal from 'sweetalert2';
import { User } from '../authentication/common/models/user';
import { UserDetail } from '../authentication/common/models/user-detail';
import { LoginService } from '../authentication/services/login.service';
import { UserService } from '../authentication/services/user.service';
import { PaginationCriteria } from '../base/models/pagination_criteria';
import { Company } from './models/company';
import { CompanyService } from './services/company.service';

@Component({
	selector: 'app-company-listing',
	templateUrl: './company-listing.component.html',
	styleUrls: ['./company-listing.component.css'],
})
export class CompanyListingComponent implements OnInit, AfterViewInit {
	@ViewChild('employeePaginator') employeePaginator: MatPaginator;
	@ViewChild('businessPaginator') businessPaginator: MatPaginator;

	user = new User();
	businessList = new Array<Company>();
	companyList = new Array<Company>();
	employeeList = new Array<UserDetail>();
	paginationCriteriaBusiness = new PaginationCriteria();
	paginationCriteriaEmployees = new PaginationCriteria();
	employeeDataSource = new MatTableDataSource<UserDetail>(this.employeeList);
	employeeColumns: string[] = ['sno', 'name', 'companies', 'username', 'email'];

	setOpenUserModal: any;
	setOpenResetPasswordModal: any;
	setOpenCompanyModal: any;
	setOpenEnlistModal: any;

	constructor(
		private loginService: LoginService,
		private companyService: CompanyService,
		private userService: UserService,
		private _snackBar: MatSnackBar,
		private ngxService: NgxUiLoaderService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.paginationCriteriaBusiness.page = 1;
		this.paginationCriteriaBusiness.limit = 5;
		this.getCompanyBusinessList();
		this.getCompanyEmployerList();
		this.paginationCriteriaEmployees.page = 1;
		this.paginationCriteriaEmployees.limit = 5;
		this.getAllEmployeeList();
		this.getUser();
	}

	ngAfterViewInit() {
		this.employeeDataSource.paginator = this.employeePaginator;
	}

	getUser() {
		setTimeout(() => {
			this.user = this.loginService.getUser();
		});
	}

	getCompanyBusinessList() {
		this.paginationCriteriaBusiness.id = this.loginService.getUser().id;
		this.companyService.getList(this.paginationCriteriaBusiness).subscribe(
			response => {
				console.log(response);
				if (response.status == 200 && response.data && response.data.company && response.data.company.list) {
					this.businessList = response.data.company.list;
					this.businessPaginator.length = response.data.company.totalRowCount;
				}
			},
			errorRes => {
				console.error(errorRes);
				this.snackBarPopup(errorRes.error.message);
			}
		);
	}

	paginationBusiness(event) {
		this.paginationCriteriaBusiness.page = event.pageIndex + 1;
		this.paginationCriteriaBusiness.limit = event.pageSize;
		this.getCompanyBusinessList();
	}

	getCompanyEmployerList() {
		this.companyService.getListByEmployeeId(this.loginService.getUser().id).subscribe(
			response => {
				console.log(response);
				if (response.status == 200 && response.data && response.data.company) {
					this.companyList = response.data.company;
				}
			},
			errorRes => {
				console.error(errorRes);
			}
		);
	}

	getAllEmployeeList() {
		this.paginationCriteriaEmployees.id = this.loginService.getUser().id;
		this.userService.getEmployeeList(this.paginationCriteriaEmployees).subscribe(
			response => {
				console.log(response);
				if (response.status == 200 && response.data && response.data.user && response.data.user.list) {
					this.employeeList = response.data.user.list;
					this.employeeDataSource = new MatTableDataSource<UserDetail>(this.employeeList);
					this.employeePaginator.length = response.data.user.totalRowCount;
				}
			},
			errorRes => {
				console.error(errorRes);
			}
		);
	}

	paginationEmployees(event) {
		this.paginationCriteriaEmployees.page = event.pageIndex + 1;
		this.paginationCriteriaEmployees.limit = event.pageSize;
		this.getAllEmployeeList();
	}

	gotoBugTracker(company: Company) {
		console.log('Bug Tracker: ' + company.dbUuid);
		this.companyService.setTenant(company.dbUuid);
		this.companyService.setCompany(company);
		this.router.navigateByUrl('bug-tracker');
	}

	openUserModal() {
		this.setOpenUserModal = {
			userId: this.user.id,
		};
	}

	openChangePasswordModal() {
		this.setOpenResetPasswordModal = {
			userId: this.user.id,
		};
	}

	openCompanyModal(companyId) {
		this.setOpenCompanyModal = {
			companyId: companyId,
		};
	}

	openEnlistingModal() {
		this.setOpenEnlistModal = {};
	}

	getUserDetails() {
		this.userService.getById(this.user.id).subscribe(response => {
			if (response.status === 200 && response.data && response.data.user) {
				this.loginService.setUser(response.data.user);
				window.location.reload();
			}
		});
	}

	passwordReset() {
		this.logout();
	}

	logoutConfirmation() {
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
				this.logout();
			}
		});
	}

	logout() {
		this.ngxService.startLoader('master');
		this.loginService.logout();
		this.companyService.exitBugTracker();
		this.router.navigate(['user/login']);
		this.ngxService.stopLoader('master');
	}

	snackBarPopup(message: string) {
		this._snackBar.open(message, 'OK', {
			duration: 3000,
			horizontalPosition: 'center',
			verticalPosition: 'top',
		});
	}
}
