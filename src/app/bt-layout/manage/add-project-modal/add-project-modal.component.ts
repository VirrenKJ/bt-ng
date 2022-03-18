import { Project } from './../models/project';
import { ProjectService } from './../services/project.service';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomValidationService } from 'src/app/authentication/services/custom-validation.service';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-add-project-modal',
	templateUrl: './add-project-modal.component.html',
	styleUrls: ['./add-project-modal.component.css'],
})
export class AddProjectModalComponent implements OnInit {
	@ViewChild('addProject') addProject: TemplateRef<any>;
	@Output() projectListEvent = new EventEmitter();

	statusList: string[] = ['Development', 'Release', 'Stable', 'Obsolete'];
	viewStatusList: string[] = ['Public', 'Private'];
	project = new Project();

	projectForm: FormGroup;

	constructor(
		private config: NgbModalConfig,
		private _snackBar: MatSnackBar,
		private modalService: NgbModal,
		private customValidationService: CustomValidationService,
		private projectService: ProjectService
	) {
		this.config.backdrop = 'static';
		this.config.keyboard = false;
	}

	ngOnInit(): void {
		this.projectForm = new FormGroup({
			id: new FormControl(null),
			name: new FormControl(null, [Validators.required, this.customValidationService.noWhitespace]),
			status: new FormControl(null, Validators.required),
			inheritCategoryFlag: new FormControl(true, Validators.required),
			viewStatus: new FormControl(null, Validators.required),
			description: new FormControl(null),
			deleteFlag: new FormControl(null),
			createdAt: new FormControl(null),
			createdBy: new FormControl(null),
			updatedAt: new FormControl(null),
			updatedBy: new FormControl(null),
		});
	}

	@Input()
	set openProjectModal(data: any) {
		if (data && !data.projectId) {
			this.openModal(this.addProject);
		}
		if (data && data.projectId) {
			this.openModal(this.addProject, data.projectId);
		}
	}

	openModal(template: TemplateRef<any>, projectId = null) {
		if (projectId) {
			this.getProject(projectId);
		}
		setTimeout(() => {
			this.modalService.open(template, { size: 'lg' });
		});
	}

	addUpdateProject() {
		if (this.projectForm.valid) {
			this.projectForm.get('name').setValue(this.projectForm.get('name').value.trim());
			if (this.projectForm.get('description').value) {
				this.projectForm.get('description').setValue(this.projectForm.get('description').value.trim());
			}
			if (!this.projectForm.get('id').value) {
				this.addProjectApi();
			} else {
				this.updateProjectApi();
			}
		} else {
			this.snackBarPopup('Invalid Form');
		}
	}

	addProjectApi() {
		this.projectService.add(this.projectForm.value).subscribe(
			response => {
				console.log(response);
				if (response.status === 200 && response.data && response.data.project) {
					this.confirmationPopup('Project Saved.');
				}
			},
			errorRes => {
				console.error(errorRes);
				this.snackBarPopup(errorRes?.error?.message);
			},
			() => {
				this.projectForm.reset();
			}
		);
	}

	updateProjectApi() {
		this.projectService.update(this.projectForm.value).subscribe(
			response => {
				console.log(response);
				if (response.status === 200 && response.data && response.data.project) {
					this.confirmationPopup('Project Updated.');
				}
			},
			errorRes => {
				console.error(errorRes);
				this.snackBarPopup(errorRes?.error?.message);
			},
			() => {
				this.projectForm.reset();
			}
		);
	}

	getProject(projectId) {
		this.projectService.getById(projectId).subscribe(response => {
			console.log(response);
			if (response.status === 200 && response.data && response.data.project) {
				this.project = response.data.project;
				this.projectForm.setValue({
					id: response.data.project.id,
					name: response.data.project.name,
					status: response.data.project.status,
					inheritCategoryFlag: response.data.project.inheritCategoryFlag,
					viewStatus: response.data.project.viewStatus,
					description: response.data.project.description,
					deleteFlag: response.data.project.deleteFlag,
					createdAt: response.data.project.createdAt,
					createdBy: response.data.project.createdBy,
					updatedAt: response.data.project.updatedAt,
					updatedBy: response.data.project.updatedBy,
				});
			}
		});
	}

	confirmationPopup(title: string) {
		Swal.fire({
			icon: 'success',
			title: title,
			showConfirmButton: false,
			timer: 2000,
		}).then(() => {
			this.projectListEvent.emit();
			this.modalService.dismissAll();
		});
	}

	snackBarPopup(message: string) {
		this._snackBar.open(message, 'OK', {
			duration: 3000,
			horizontalPosition: 'center',
			verticalPosition: 'top',
		});
	}
}
