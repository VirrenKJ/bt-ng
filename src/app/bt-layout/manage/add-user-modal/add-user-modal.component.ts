import { RoleService } from './../../../authentication/services/role.service';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Role } from 'src/app/authentication/common/models/role';
import { User } from 'src/app/authentication/common/models/user';
import { CustomValidationService } from 'src/app/authentication/services/custom-validation.service';
import { UserService } from 'src/app/authentication/services/user.service';
import { PaginationCriteria } from 'src/app/base/models/pagination_criteria';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-add-user-modal',
	templateUrl: './add-user-modal.component.html',
	styleUrls: ['./add-user-modal.component.css'],
	providers: [NgbModalConfig, NgbModal],
})
export class AddUserModalComponent implements OnInit {
	@ViewChild('addUser') addUser: TemplateRef<any>;
	@Output() userListEvent = new EventEmitter();

	projectList = new Array<User>();
	paginationCriteriaUser = new PaginationCriteria();
	showPassword: boolean = false;
	showConfirmPassword: boolean = false;

	userForm: FormGroup;

	constructor(
		config: NgbModalConfig,
		private _snackBar: MatSnackBar,
		private userService: UserService,
		private roleService: RoleService,
		private customValidationService: CustomValidationService,
		private modalService: NgbModal
	) {
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
		this.formInIt();
		this.getUserList();
	}

	formInIt() {
		this.userForm = new FormGroup(
			{
				id: new FormControl(null),
				username: new FormControl(
					null,
					[Validators.required, Validators.minLength(5), this.customValidationService.noWhitespace],
					this.customValidationService.usernameValidator.bind(this.customValidationService)
				),
				password: new FormControl(null, [Validators.required, this.customValidationService.patternValidator]),
				confirmPassword: new FormControl(null, Validators.required),
				firstName: new FormControl(null, [Validators.required, this.customValidationService.noWhitespace]),
				lastName: new FormControl(null, [Validators.required, this.customValidationService.noWhitespace]),
				email: new FormControl(null, [Validators.required, Validators.email]),
				enabled: new FormControl(true),
				roles: new FormControl(),
				deleteFlag: new FormControl(null),
				createdAt: new FormControl(null),
				createdBy: new FormControl(null),
				updatedAt: new FormControl(null),
				updatedBy: new FormControl(null),
			},
			{
				validators: this.customValidationService.MatchPassword('password', 'confirmPassword'),
			}
		);
	}

	@Input()
	set openUserModal(data: any) {
		if (data && !data.userId) {
			this.formInIt();
			this.openModal(this.addUser);
		}
		if (data && data.userId) {
			this.openModal(this.addUser, data.userId);
		}
	}

	openModal(template: TemplateRef<any>, userId = null) {
		if (userId) {
			this.getUser(userId);
		}
		setTimeout(() => {
			this.modalService.open(template, { size: 'lg' });
		});
	}

	addUpdateUser() {
		if (this.userForm.valid) {
			if (!this.userForm.get('id').value) {
				//add role
				let roles = new Array<Role>();
				let role = new Role();
				role.roleId = 1;
				roles.push(role);
				this.userForm.get('roles').patchValue(roles);

				//remove whitespace
				this.userForm.get('username').setValue(this.userForm.get('username').value.trim());
				this.userForm.get('firstName').setValue(this.userForm.get('firstName').value.trim());
				this.userForm.get('lastName').setValue(this.userForm.get('lastName').value.trim());
				this.userForm.get('email').setValue(this.userForm.get('email').value.trim());
				this.addUserApi();
			} else {
				this.updateUserApi();
			}
		} else {
			this.snackBarPopup('Invalid Form');
		}
	}

	addUserApi() {
		this.userService.add(this.userForm.value).subscribe(
			response => {
				console.log(response);
				this.confirmationPopup('User Registered');
			},
			errorRes => {
				console.log(errorRes);
				this.snackBarPopup(errorRes.error.message);
			},
			() => {
				this.userForm.reset();
			}
		);
	}

	updateUserApi() {
		this.userService.update(this.userForm.value).subscribe(
			response => {
				console.log(response);
				this.confirmationPopup('User Updated');
			},
			errorRes => {
				console.log(errorRes);
				this.snackBarPopup(errorRes.error.message);
			},
			() => {
				this.userForm.reset();
			}
		);
	}

	getUser(userId) {
		this.userService.getById(userId).subscribe(response => {
			console.log(response);
			if (response.status === 200 && response.data && response.data.user) {
				this.userForm.setValue({
					id: response.data.user.id,
					name: response.data.user.name,
					assignedId: response.data.user.assignedId,
					deleteFlag: response.data.user.deleteFlag,
					createdAt: response.data.user.createdAt,
					createdBy: response.data.user.createdBy,
					updatedAt: response.data.user.updatedAt,
					updatedBy: response.data.user.updatedBy,
				});
			}
		});
	}

	getUserList() {
		this.userService.getList(this.paginationCriteriaUser).subscribe(
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

	password() {
		this.showPassword = !this.showPassword;
	}

	confirmPassword() {
		this.showConfirmPassword = !this.showConfirmPassword;
	}

	confirmationPopup(title: string) {
		Swal.fire({
			icon: 'success',
			title: title,
			showConfirmButton: false,
			timer: 2000,
		}).then(() => {
			this.userListEvent.emit();
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
