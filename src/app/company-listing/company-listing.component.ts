import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { UserDetail } from '../authentication/common/models/user-detail';
import { LoginService } from '../authentication/services/login.service';
import { UserService } from '../authentication/services/user.service';
import { SearchCriteriaObj } from '../base/models/search_criteria_obj';
import { SearchFieldObj } from '../base/models/search_field_obj';
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
	businessList = new Array<Company>();
	companyList = new Array<Company>();
	employeeList = new Array<UserDetail>();
	searchCriteriaObjBusiness = new SearchCriteriaObj();
	searchCriteriaObjEmployees = new SearchCriteriaObj();

	employeeColumns: string[] = ['sno', 'name', 'companies', 'username', 'email'];
	employeeDataSource = new MatTableDataSource<UserDetail>(this.employeeList);

	setOpenUserModal: any;
	setOpenCompanyModal: any;
	setOpenEnlistModal: any;
	faUser = faUser;

	// perPageBusiness: number;

	constructor(
		private loginService: LoginService,
		private companyService: CompanyService,
		private userService: UserService,
		private _snackBar: MatSnackBar,
		private router: Router
	) {}

	ngOnInit(): void {
		// this.perPageBusiness = 5;
		this.searchCriteriaObjBusiness.page = 1;
		this.searchCriteriaObjBusiness.limit = 5;
		this.getCompanyBusinessList();
		this.getCompanyEmployerList();
		this.searchCriteriaObjEmployees.page = 1;
		this.searchCriteriaObjEmployees.limit = 5;
		this.getAllEmployeeList();
	}

	ngAfterViewInit() {
		this.employeeDataSource.paginator = this.employeePaginator;
		// this.businessPaginator.pageSize = this.perPageBusiness;
	}

	getCompanyBusinessList() {
		this.searchCriteriaObjBusiness.id = this.loginService.getUser().id;
		this.companyService.getList(this.searchCriteriaObjBusiness).subscribe(
			response => {
				console.log(response);
				if (response.status == 200 && response.data && response.data.company && response.data.company.list && response.data.company.list.length > 0) {
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
		this.searchCriteriaObjBusiness.page = event.pageIndex + 1;
		this.searchCriteriaObjBusiness.limit = event.pageSize;
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
		this.searchCriteriaObjEmployees.id = this.loginService.getUser().id;
		this.userService.getEmployeeList(this.searchCriteriaObjEmployees).subscribe(
			response => {
				console.log(response);
				if (response.status == 200 && response.data && response.data.user && response.data.user.list && response.data.user.list.length > 0) {
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
		this.searchCriteriaObjBusiness.page = event.pageIndex + 1;
		this.searchCriteriaObjBusiness.limit = event.pageSize;
		this.getCompanyBusinessList();
	}

	gotoBugTracker(dbUuid: string) {
		console.log('Bug Tracker: ' + dbUuid);
		this.companyService.setTenant(dbUuid);
		this.router.navigateByUrl('bug-tracker');
	}

	openUserModal(userId) {
		this.setOpenUserModal = {
			userId: userId,
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

	logout() {
		this.loginService.logout();
	}

	snackBarPopup(message: string) {
		this._snackBar.open(message, 'OK', {
			duration: 3000,
			horizontalPosition: 'center',
			verticalPosition: 'top',
		});
	}
}
