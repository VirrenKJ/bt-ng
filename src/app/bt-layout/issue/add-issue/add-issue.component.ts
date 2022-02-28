import { IssueService } from './../services/issue.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from 'src/app/authentication/common/models/user';
import { UserService } from 'src/app/authentication/services/user.service';
import { PaginationCriteria } from 'src/app/base/models/pagination_criteria';
import { GlobalCategory } from '../../manage/models/global-category';
import { Project } from '../../manage/models/project';
import { SystemProfile } from '../../manage/models/system-profile';
import { GlobalCategoryService } from '../../manage/services/global-category.service';
import { ProjectService } from '../../manage/services/project.service';
import { SystemProfileService } from '../../manage/services/system-profile.service';
import Swal from 'sweetalert2';
import { Issue } from '../models/issue';
import { CustomValidationService } from 'src/app/authentication/services/custom-validation.service';

@Component({
	selector: 'app-add-issue',
	templateUrl: './add-issue.component.html',
	styleUrls: ['./add-issue.component.css'],
})
export class AddIssueComponent implements OnInit {
	userList = new Array<User>();
	projectList = new Array<Project>();
	categoryList = new Array<GlobalCategory>();
	systemProfileList = new Array<SystemProfile>();

	paginationCriteriaUser = new PaginationCriteria();
	paginationCriteriaProject = new PaginationCriteria();
	paginationCriteriaProfile = new PaginationCriteria();
	paginationCriteriaCategory = new PaginationCriteria();

	reproducibilityList = ['always', 'sometimes', 'random', 'have not tried', 'unable to reproduce', 'N/A'];
	severityList = ['feature', 'trivial', 'text', 'tweak', 'minor', 'major', 'crash', 'block'];
	priorityList = ['none', 'low', 'normal', 'high', 'urgent', 'immediate'];

	constructor(
		private _snackBar: MatSnackBar,
		private issueService: IssueService,
		private projectService: ProjectService,
		private systemProfileService: SystemProfileService,
		private userService: UserService,
		private globalCategoryService: GlobalCategoryService,
		private customValidationService: CustomValidationService
	) {}

	ngOnInit(): void {
		this.getUserList();
		this.getProjectList();
		this.getSystemProfileList();
		this.getGlobalCategoryList();
	}

	issueForm = new FormGroup({
		id: new FormControl(),
		projectId: new FormControl(null, Validators.required),
		categoryId: new FormControl(null, Validators.required),
		reproducibility: new FormControl(null, Validators.required),
		severity: new FormControl(null, Validators.required),
		priority: new FormControl(null, Validators.required),
		profileId: new FormControl(null, Validators.required),
		assignedId: new FormControl(null, Validators.required),
		summary: new FormControl(null, [Validators.required, this.customValidationService.noWhitespace]),
		description: new FormControl(),
		stepsToReproduce: new FormControl(),
		addInfo: new FormControl(),
		documentId: new FormControl(),
		viewStatus: new FormControl(),
		deleteFlag: new FormControl(),
		createdAt: new FormControl(null),
		createdBy: new FormControl(null),
		updatedAt: new FormControl(null),
		updatedBy: new FormControl(null),
	});

	getProjectList() {
		this.projectService.getList(this.paginationCriteriaProject).subscribe(
			response => {
				console.log(response);
				if (response.status == 200 && response.data && response.data.project && response.data.project.list) {
					this.projectList = response.data.project.list;
				}
			},
			errorRes => {
				console.error(errorRes);
				this.snackBarPopup(errorRes.error.message);
			}
		);
	}

	getSystemProfileList() {
		this.systemProfileService.getList(this.paginationCriteriaProfile).subscribe(
			response => {
				console.log(response);
				if (response.status == 200 && response.data && response.data.systemProfile && response.data.systemProfile.list) {
					this.systemProfileList = response.data.systemProfile.list;
				}
			},
			errorRes => {
				console.error(errorRes);
				this.snackBarPopup(errorRes.error.message);
			}
		);
	}

	getGlobalCategoryList() {
		this.globalCategoryService.getList(this.paginationCriteriaCategory).subscribe(
			response => {
				console.log(response);
				if (response.status == 200 && response.data && response.data.globalCategory && response.data.globalCategory.list) {
					this.categoryList = response.data.globalCategory.list;
				}
			},
			errorRes => {
				console.error(errorRes);
				this.snackBarPopup(errorRes.error.message);
			}
		);
	}

	getUserList() {
		this.userService.getList(this.paginationCriteriaUser).subscribe(
			response => {
				console.log(response);
				if (response.status == 200 && response.data && response.data.user && response.data.user.list) {
					this.userList = response.data.user.list;
				}
			},
			errorRes => {
				console.error(errorRes);
				this.snackBarPopup(errorRes.error.message);
			}
		);
	}

	onSubmit() {
		if (this.issueForm.valid) {
			if (!this.issueForm.get('id').value) {
				this.addIssueApi();
			} else {
				this.updateIssueApi();
			}
		} else {
			this.snackBarPopup('Invalid Form');
		}
	}

	addIssueApi() {
		this.issueService.add(this.issueForm.value).subscribe(
			response => {
				console.log(response);
				if (response.status === 200 && response.data && response.data.globalIssue) {
					this.confirmationPopup('Issue Saved.');
				}
			},
			errorRes => {
				console.error(errorRes);
				this.snackBarPopup(errorRes.error.message);
			},
			() => {
				this.issueForm.reset();
			}
		);
	}

	updateIssueApi() {
		this.issueService.update(this.issueForm.value).subscribe(
			response => {
				console.log(response);
				if (response.status === 200 && response.data && response.data.globalIssue) {
					this.confirmationPopup('Issue Updated.');
				}
			},
			errorRes => {
				console.error(errorRes);
				this.snackBarPopup(errorRes.error.message);
			},
			() => {
				this.issueForm.reset();
			}
		);
	}

	confirmationPopup(title: string) {
		Swal.fire({
			icon: 'success',
			title: title,
			showConfirmButton: false,
			timer: 2000,
		}).then(() => {});
	}

	snackBarPopup(message: string) {
		this._snackBar.open(message, 'OK', {
			duration: 3000,
			horizontalPosition: 'center',
			verticalPosition: 'top',
		});
	}
}
