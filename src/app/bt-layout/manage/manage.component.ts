import { Company } from 'src/app/company-listing/models/company';
import { GlobalCategoryService } from './services/global-category.service';
import { UserService } from './../../authentication/services/user.service';
import { GlobalCategory } from './models/global-category';
import { Project } from './models/project';
import { User } from './../../authentication/common/models/user';
import { ProjectService } from './services/project.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { PaginationCriteria } from 'src/app/base/models/pagination_criteria';
import Swal from 'sweetalert2';
import { LoginService } from '../../authentication/services/login.service';
import { SystemProfile } from './models/system-profile';
import { SystemProfileService } from './services/system-profile.service';
import { CompanyService } from 'src/app/company-listing/services/company.service';

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

	paginationCriteriaUser = new PaginationCriteria();
	paginationCriteriaProject = new PaginationCriteria();
	paginationCriteriaCategory = new PaginationCriteria();
	paginationCriteriaProfile = new PaginationCriteria();

	userList = new Array<User>();
	projectList = new Array<Project>();
	categoryList = new Array<GlobalCategory>();
	systemProfileList = new Array<SystemProfile>();

	userColumns: string[] = ['sno', 'name', 'username', 'role', 'enabled', 'action'];
	projectColumns: string[] = ['sno', 'name', 'status', 'viewStatus', 'categoryFlag', 'description', 'action'];
	categoryColumns: string[] = ['sno', 'name', 'project', 'action'];
	profileColumns: string[] = ['sno', 'platform', 'os', 'version', 'desc', 'action'];

	userDataSource = new MatTableDataSource<User>(this.userList);
	projectDataSource = new MatTableDataSource<Project>(this.projectList);
	categoryDataSource = new MatTableDataSource<GlobalCategory>(this.categoryList);
	profileDataSource = new MatTableDataSource<SystemProfile>(this.systemProfileList);

	setOpenUserModal: any;
	setOpenProjectModal: any;
	setOpenCategoryModal: any;
	setOpenProfileModal: any;

	adminRole: boolean = false;

	constructor(
		private loginService: LoginService,
		private userService: UserService,
		private projectService: ProjectService,
		private globalCategoryService: GlobalCategoryService,
		private companyService: CompanyService,
		private systemProfileService: SystemProfileService,
		private _snackBar: MatSnackBar
	) {}

	ngOnInit(): void {
		if (this.loginService.getUserRole() == 'Admin') {
			this.adminRole = true;
		}
		this.paginationInIt();
		this.apiInIt();
	}

	apiInIt() {
		this.getUserList();
		this.getProjectList();
		this.getGlobalCategoryList();
		this.getSystemProfileList();
	}

	paginationInIt() {
		this.paginationCriteriaUser.page = 1;
		this.paginationCriteriaUser.limit = 5;
		this.paginationCriteriaProject.page = 1;
		this.paginationCriteriaProject.limit = 5;
		this.paginationCriteriaCategory.page = 1;
		this.paginationCriteriaCategory.limit = 5;
		this.paginationCriteriaProfile.page = 1;
		this.paginationCriteriaProfile.limit = 5;
	}

	ngAfterViewInit() {
		this.userDataSource.paginator = this.userPaginator;
		this.projectDataSource.paginator = this.projectPaginator;
		this.categoryDataSource.paginator = this.categoryPaginator;
		this.profileDataSource.paginator = this.profilePaginator;
	}

	getUserList() {
		this.userService.getList(this.paginationCriteriaUser).subscribe(
			response => {
				console.log(response);
				if (response.status == 200 && response.data && response.data.user && response.data.user.list) {
					this.userList = response.data.user.list;
					this.userDataSource = new MatTableDataSource<User>(this.userList);
					this.userPaginator.length = response.data.user.totalRowCount;
				}
			},
			errorRes => {
				console.error(errorRes);
				this.snackBarPopup(errorRes.error.message);
			}
		);
	}

	paginationUser(event) {
		this.paginationCriteriaUser.page = event.pageIndex + 1;
		this.paginationCriteriaUser.limit = event.pageSize;
		this.getUserList();
	}

	getProjectList() {
		this.projectService.getList(this.paginationCriteriaProject).subscribe(
			response => {
				console.log(response);
				if (response.status == 200 && response.data && response.data.project && response.data.project.list) {
					this.projectList = response.data.project.list;
					this.projectDataSource = new MatTableDataSource<Project>(this.projectList);
					this.projectPaginator.length = response.data.project.totalRowCount;
				}
			},
			errorRes => {
				console.error(errorRes);
				this.snackBarPopup(errorRes.error.message);
			}
		);
	}

	paginationProject(event) {
		this.paginationCriteriaProject.page = event.pageIndex + 1;
		this.paginationCriteriaProject.limit = event.pageSize;
		this.getProjectList();
	}

	getGlobalCategoryList() {
		this.globalCategoryService.getList(this.paginationCriteriaCategory).subscribe(
			response => {
				console.log(response);
				if (response.status == 200 && response.data && response.data.globalCategory && response.data.globalCategory.list) {
					this.categoryList = response.data.globalCategory.list;
					this.categoryDataSource = new MatTableDataSource<GlobalCategory>(this.categoryList);
					this.categoryPaginator.length = response.data.globalCategory.totalRowCount;
				}
			},
			errorRes => {
				console.error(errorRes);
				this.snackBarPopup(errorRes.error.message);
			}
		);
	}

	paginationGlobalCategory(event) {
		this.paginationCriteriaCategory.page = event.pageIndex + 1;
		this.paginationCriteriaCategory.limit = event.pageSize;
		this.getGlobalCategoryList();
	}

	getSystemProfileList() {
		this.systemProfileService.getList(this.paginationCriteriaProfile).subscribe(
			response => {
				console.log(response);
				if (response.status == 200 && response.data && response.data.systemProfile && response.data.systemProfile.list) {
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

	deleteUser(userId) {
		this.deleteConfirmationPopup().then(result => {
			if (result.value) {
				this.userService.delete(userId).subscribe(response => {
					if (response.status == 200) {
						this.deletedConfirmationPopup(response.message, 'User');
					}
				});
			}
		});
	}

	deleteProject(projectId) {
		this.deleteConfirmationPopup().then(result => {
			if (result.value) {
				this.projectService.delete(projectId).subscribe(response => {
					if (response.status == 200) {
						this.deletedConfirmationPopup(response.message, 'Project');
					}
				});
			}
		});
	}

	deleteCategory(categoryId) {
		this.deleteConfirmationPopup().then(result => {
			if (result.value) {
				this.globalCategoryService.delete(categoryId).subscribe(response => {
					if (response.status == 200) {
						this.deletedConfirmationPopup(response.message, 'Global Category');
					}
				});
			}
		});
	}

	deleteProfile(profileId) {
		this.deleteConfirmationPopup().then(result => {
			if (result.value) {
				this.systemProfileService.delete(profileId).subscribe(response => {
					if (response.status == 200) {
						this.deletedConfirmationPopup(response.message, 'Profile');
					}
				});
			}
		});
	}

	snackBarPopup(message: string) {
		this._snackBar.open(message, 'OK', {
			duration: 3000,
			horizontalPosition: 'center',
			verticalPosition: 'top',
		});
	}

	deleteConfirmationPopup() {
		return Swal.fire({
			title: 'Warning',
			text: 'Are you sure that you want to perform this action?',
			icon: 'question',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes',
			cancelButtonText: 'No',
			allowOutsideClick: false,
			allowEscapeKey: false,
		});
	}

	deletedConfirmationPopup(message, title) {
		Swal.fire({
			title: title,
			text: message,
			icon: 'success',
			allowOutsideClick: false,
			allowEscapeKey: false,
		}).then(result => {
			if (result.value) {
				this.getSystemProfileList();
			}
		});
	}
}
