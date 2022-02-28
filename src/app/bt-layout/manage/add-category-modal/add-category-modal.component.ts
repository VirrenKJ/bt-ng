import { GlobalCategory } from './../models/global-category';
import { GlobalCategoryService } from './../services/global-category.service';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomValidationService } from 'src/app/authentication/services/custom-validation.service';
import Swal from 'sweetalert2';
import { Project } from '../models/project';
import { ProjectService } from '../services/project.service';
import { PaginationCriteria } from 'src/app/base/models/pagination_criteria';

@Component({
	selector: 'app-add-category-modal',
	templateUrl: './add-category-modal.component.html',
	styleUrls: ['./add-category-modal.component.css'],
	providers: [NgbModalConfig, NgbModal],
})
export class AddCategoryModalComponent implements OnInit {
	@ViewChild('addCategory') addCategory: TemplateRef<any>;
	@Output() categoryListEvent = new EventEmitter();

	projectList = new Array<Project>();
	paginationCriteriaProject = new PaginationCriteria();

	categoryForm: FormGroup;

	constructor(
		config: NgbModalConfig,
		private _snackBar: MatSnackBar,
		private globalCategoryService: GlobalCategoryService,
		private customValidationService: CustomValidationService,
		private projectService: ProjectService,
		private modalService: NgbModal
	) {
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
		this.categoryForm = new FormGroup({
			id: new FormControl(null),
			name: new FormControl(null, [Validators.required, this.customValidationService.noWhitespace]),
			assignedId: new FormControl(null, Validators.required),
			deleteFlag: new FormControl(null),
			createdAt: new FormControl(null),
			createdBy: new FormControl(null),
			updatedAt: new FormControl(null),
			updatedBy: new FormControl(null),
		});
		this.getProjectList();
	}

	@Input()
	set openCategoryModal(data: any) {
		if (data && !data.categoryId) {
			this.openModal(this.addCategory);
		}
		if (data && data.categoryId) {
			this.openModal(this.addCategory, data.categoryId);
		}
	}

	openModal(template: TemplateRef<any>, categoryId = null) {
		if (categoryId) {
			this.getCategory(categoryId);
		}
		setTimeout(() => {
			this.modalService.open(template, { size: 'lg' });
		});
	}

	addUpdateCategory() {
		if (this.categoryForm.valid) {
			this.categoryForm.get('name').setValue(this.categoryForm.get('name').value.trim());
			if (!this.categoryForm.get('id').value) {
				this.addCategoryApi();
			} else {
				this.updateCategoryApi();
			}
		} else {
			this.snackBarPopup('Invalid Form');
		}
	}

	addCategoryApi() {
		this.globalCategoryService.add(this.categoryForm.value).subscribe(
			response => {
				console.log(response);
				if (response.status === 200 && response.data && response.data.globalCategory) {
					this.confirmationPopup('Global Category Saved.');
				}
			},
			errorRes => {
				console.error(errorRes);
				this.snackBarPopup(errorRes.error.message);
			},
			() => {
				this.categoryForm.reset();
			}
		);
	}

	updateCategoryApi() {
		this.globalCategoryService.update(this.categoryForm.value).subscribe(
			response => {
				console.log(response);
				if (response.status === 200 && response.data && response.data.globalCategory) {
					this.confirmationPopup('Global Category Updated.');
				}
			},
			errorRes => {
				console.error(errorRes);
				this.snackBarPopup(errorRes.error.message);
			},
			() => {
				this.categoryForm.reset();
			}
		);
	}

	getCategory(categoryId) {
		this.globalCategoryService.getById(categoryId).subscribe(response => {
			console.log(response);
			if (response.status === 200 && response.data && response.data.globalCategory) {
				this.categoryForm.setValue({
					id: response.data.globalCategory.id,
					name: response.data.globalCategory.name,
					assignedId: response.data.globalCategory.assignedId,
					deleteFlag: response.data.globalCategory.deleteFlag,
					createdAt: response.data.globalCategory.createdAt,
					createdBy: response.data.globalCategory.createdBy,
					updatedAt: response.data.globalCategory.updatedAt,
					updatedBy: response.data.globalCategory.updatedBy,
				});
			}
		});
	}

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

	confirmationPopup(title: string) {
		Swal.fire({
			icon: 'success',
			title: title,
			showConfirmButton: false,
			timer: 2000,
		}).then(() => {
			this.categoryListEvent.emit();
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
