import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { PaginationCriteria } from 'src/app/base/models/pagination_criteria';
import { LoginService } from '../../authentication/services/login.service';
import { SystemProfile } from './models/system-profile';
import { SystemProfileService } from './services/system-profile.service';

@Component({
	selector: 'app-manage',
	templateUrl: './manage.component.html',
	styleUrls: ['./manage.component.css'],
})
export class ManageComponent implements OnInit, AfterViewInit {
	@ViewChild('userPaginator') userPaginator: MatPaginator;
	@ViewChild('projectPaginator') projectPaginator: MatPaginator;
	@ViewChild('profilePaginator') profilePaginator: MatPaginator;
	@ViewChild('categoryPaginator') categoryPaginator: MatPaginator;

	paginationCriteriaProfile = new PaginationCriteria();
	systemProfileList = new Array<SystemProfile>();

	userColumns: string[] = ['position', 'name', 'weight', 'symbol'];
	projectColumns: string[] = ['position', 'name', 'weight', 'symbol'];
	profileColumns: string[] = ['sno', 'platform', 'os', 'version', 'desc'];
	categoryColumns: string[] = ['position', 'name', 'weight', 'symbol'];

	userDataSource = new MatTableDataSource<Users>(users);
	projectDataSource = new MatTableDataSource<Users>(projects);
	profileDataSource = new MatTableDataSource<SystemProfile>(this.systemProfileList);
	categoryDataSource = new MatTableDataSource<Users>(globalCategories);

	setOpenUserModal: any;
	setOpenProjectModal: any;
	setOpenCategoryModal: any;
	setOpenProfileModal: any;

	adminRole: boolean = false;

	constructor(private loginService: LoginService, private systemProfileService: SystemProfileService, private _snackBar: MatSnackBar) {}

	ngOnInit(): void {
		if (this.loginService.getUserRole() == 'Admin') {
			this.adminRole = true;
		}
		this.paginationCriteriaProfile.page = 1;
		this.paginationCriteriaProfile.limit = 5;
		this.getSystemProfileList();
	}

	ngAfterViewInit() {
		this.userDataSource.paginator = this.userPaginator;
		this.projectDataSource.paginator = this.projectPaginator;
		this.profileDataSource.paginator = this.profilePaginator;
		this.categoryDataSource.paginator = this.categoryPaginator;
	}

	getSystemProfileList() {
		this.systemProfileService.getList(this.paginationCriteriaProfile).subscribe(
			response => {
				console.log(response);
				if (
					response.status == 200 &&
					response.data &&
					response.data.systemProfile &&
					response.data.systemProfile.list &&
					response.data.systemProfile.list.length > 0
				) {
					this.systemProfileList = response.data.systemProfile.list;
					this.profileDataSource = new MatTableDataSource<SystemProfile>(this.systemProfileList);
					this.profilePaginator.length = response.data.systemProfile.totalRowCount;
				}
			},
			errorRes => {
				console.error(errorRes);
				this.snackBarPopup(errorRes.error.message);
			}
		);
	}

	paginationProfile(event) {
		this.paginationCriteriaProfile.page = event.pageIndex + 1;
		this.paginationCriteriaProfile.limit = event.pageSize;
		this.getSystemProfileList();
	}

	openUserModal(userId) {
		this.setOpenUserModal = {
			userId: userId,
		};
	}

	openProjectModal(projectId) {
		this.setOpenProjectModal = {
			projectId: projectId,
		};
	}

	openCategoryModal(categoryId) {
		this.setOpenCategoryModal = {
			categoryId: categoryId,
		};
	}

	openProfileModal(profileId) {
		this.setOpenProfileModal = {
			profileId: profileId,
		};
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

export interface Projects {
	name: string;
	position: number;
	weight: number;
	symbol: string;
}

export interface GlobalCategory {
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

const projects: Projects[] = [
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

const globalCategories: GlobalCategory[] = [
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
