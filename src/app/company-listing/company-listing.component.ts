import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { LoginService } from '../authentication/services/login.service';
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
	@ViewChild('userPaginator') userPaginator: MatPaginator;
	@ViewChild('businessPaginator') businessPaginator: MatPaginator;
	businessList = new Array<Company>();
	searchCriteriaObjBusiness = new SearchCriteriaObj();

	businessColumns: string[] = ['position', 'name', 'weight', 'symbol'];
	businessDataSource = new MatTableDataSource<Company>(this.businessList);

	userColumns: string[] = ['position', 'name', 'weight', 'symbol'];
	userDataSource = new MatTableDataSource<Users>(users);

	setOpenUserModal: any;
	setOpenCompanyModal: any;
	faUser = faUser;

	perPageBusiness: number;
	// totalBusiness: number;

	constructor(private loginService: LoginService, private companyService: CompanyService, private _snackBar: MatSnackBar) {}

	ngOnInit(): void {
		this.perPageBusiness = 10;
		this.searchCriteriaObjBusiness.page = 1;
		this.searchCriteriaObjBusiness.limit = 10;
		this.getCompanyBusinessList();
	}

	ngAfterViewInit() {
		this.userDataSource.paginator = this.userPaginator;
		this.businessDataSource.paginator = this.businessPaginator;
		// this.businessPaginator.pageSize = this.perPageBusiness;
	}

	getCompanyBusinessList() {
		this.searchCriteriaObjBusiness.searchFieldsObj = new SearchFieldObj();
		this.searchCriteriaObjBusiness.searchFieldsObj.id = this.loginService.getUser().id;
		this.companyService.getBusinessList(this.searchCriteriaObjBusiness).subscribe(
			response => {
				console.log(response);
				if (response.data.company.list) {
					this.businessList = response.data.company.list;
					this.businessDataSource = new MatTableDataSource<Company>(this.businessList);
					this.businessPaginator.length = response.data.company.totalRowCount;
				}
			},
			errorRes => {
				console.error(errorRes);
				this.snackBarPopup(errorRes.error.message);
			}
		);
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

export interface Users {
	name: string;
	position: number;
	weight: number;
	symbol: string;
}

const users: Users[] = [
	{ position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
	{ position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
	{ position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
	{ position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
	{ position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
	{ position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
	{ position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
	{ position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
	{ position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
	{ position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
	{ position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na' },
	{ position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg' },
	{ position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al' },
	{ position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si' },
	{ position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P' },
	{ position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S' },
	{ position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl' },
	{ position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar' },
	{ position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K' },
	{ position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca' },
];