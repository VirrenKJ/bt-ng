import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaginationCriteria } from 'src/app/base/models/pagination_criteria';
import { Project } from '../../manage/models/project';
import { SystemProfile } from '../../manage/models/system-profile';
import { ProjectService } from '../../manage/services/project.service';
import { SystemProfileService } from '../../manage/services/system-profile.service';

@Component({
	selector: 'app-add-issue',
	templateUrl: './add-issue.component.html',
	styleUrls: ['./add-issue.component.css'],
})
export class AddIssueComponent implements OnInit {
	projectList = new Array<Project>();
	systemProfileList = new Array<SystemProfile>();
	paginationCriteriaProject = new PaginationCriteria();
	paginationCriteriaProfile = new PaginationCriteria();

	constructor(private _snackBar: MatSnackBar, private projectService: ProjectService, private systemProfileService: SystemProfileService) {}

	ngOnInit(): void {
		this.getProjectList();
		this.getSystemProfileList();
	}

	issueForm = new FormGroup({
		id: new FormControl(),
		projectId: new FormControl(null, Validators.required),
		categoryId: new FormControl(null, Validators.required),
		reproducibilityId: new FormControl(null, Validators.required),
		severityId: new FormControl(null, Validators.required),
		priorityId: new FormControl(null, Validators.required),
		profileId: new FormControl(null, Validators.required),
		assignedId: new FormControl(null, Validators.required),
		summary: new FormControl(),
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

	onSubmit() {
		console.log('Submitted!');
	}

	snackBarPopup(message: string) {
		this._snackBar.open(message, 'OK', {
			duration: 3000,
			horizontalPosition: 'center',
			verticalPosition: 'top',
		});
	}
}
