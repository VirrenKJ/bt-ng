import { Company } from './../../../company-listing/models/company';
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
import { CompanyService } from 'src/app/company-listing/services/company.service';
import { UserDetail } from 'src/app/authentication/common/models/user-detail';

@Component({
	selector: 'app-add-user-modal',
	templateUrl: './add-user-modal.component.html',
	styleUrls: ['./add-user-modal.component.css'],
	providers: [NgbModalConfig, NgbModal],
})
export class AddUserModalComponent implements OnInit {
	@ViewChild('addUser') addUser: TemplateRef<any>;
	@Output() userListEvent = new EventEmitter();

	paginationCriteriaUser = new PaginationCriteria();
	userDetail = new UserDetail();
	userList = new Array<User>();
	roles = new Array<Role>();
	role = new Role();
	user = new User();
	showPassword: boolean = false;
	showConfirmPassword: boolean = false;

	userForm: FormGroup;
	userId: number;

	constructor(
		config: NgbModalConfig,
		private _snackBar: MatSnackBar,
		private userService: UserService,
		private roleService: RoleService,
		private companyService: CompanyService,
		private customValidationService: CustomValidationService,
		private modalService: NgbModal
	) {
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
		this.formInIt();
		this.getUserList();
		this.getRoles();
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
			},
			{
				validators: this.customValidationService.MatchPassword('password', 'confirmPassword'),
			}
		);
	}

	@Input()
	set openUserModal(data: any) {
		if (data && !data.userId) {
			this.openModal(this.addUser);
		}
		if (data && data.userId) {
			this.openModal(this.addUser, data.userId);
		}
	}

	openModal(template: TemplateRef<any>, userId = null) {
		this.formInIt();
		this.userId = null;
		this.role = new Role();
		if (userId) {
			this.getUser(userId);
			this.userId = userId;
		} else {
			localStorage.removeItem('edit-username');
		}
		setTimeout(() => {
			this.modalService.open(template, { size: 'lg' });
		});
	}

	getRoles() {
		let paginationCriteria = new PaginationCriteria();
		this.roleService.getList(paginationCriteria).subscribe(
			response => {
				if (response.data && response.data.role) {
					this.roles = response.data.role;
				}
			},
			errorRes => {
				console.error(errorRes);
			}
		);
	}

	addUpdateUser() {
		console.log(this.userForm.value);

		if (this.userForm.valid) {
			console.log(this.userForm.valid);

			// add role
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
			if (!this.userForm.get('id').value) {
				this.addUserApi();
			} else {
				this.updateUserApi();
			}
		} else {
			this.snackBarPopup('Invalid Form');
		}
	}

	addUserApi() {
		let dbUuid = this.companyService.temporarilyRemoveTenant();
		this.userService.add(this.userForm.value).subscribe(
			response => {
				console.log(response);
				if (response.status == 200 && response.data && response.data.user) {
					this.userDetail = response.data.user;

					let company: Company = this.companyService.getCompany();
					if (!company.userDetails) {
						company.userDetails = new Array<UserDetail>();
					}
					company.userDetails.push(this.setUserDetail());
					console.log(company);
					this.companyService.update(company).subscribe(
						response => {
							console.log(response);
							if (dbUuid) {
								this.companyService.setTenant(dbUuid);
							}
							this.userDetailsToCompany();
							this.confirmationPopup('Enlisted Successfully');
						},
						errorRes => {
							console.error(errorRes);
							this.snackBarPopup(errorRes.error.message);
						}
					);
				}
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

	userDetailsToCompany(update: boolean = false) {
		if (this.userDetail['authorities']) {
			this.userDetail['authorities'] = null;
		}
		this.userDetail.roles = new Array<Role>();
		this.userDetail.roles.push(this.role);

		if (update) {
			this.userService.updateUserDetailsToCompany(this.userDetail).subscribe(response => {
				console.log(response);
			});
		} else {
			this.userService.addUserDetailsToCompany(this.userDetail).subscribe(response => {
				console.log(response);
			});
		}
	}

	setUserDetail() {
		let userDetail = new UserDetail();
		userDetail.id = this.userDetail.id;
		return userDetail;
	}

	updateUserApi() {
		let dbUuid = this.companyService.temporarilyRemoveTenant();
		this.userService.update(this.userForm.value).subscribe(
			response => {
				console.log(response);
				if (response.status == 200 && response.data && response.data.user) {
					this.userDetail = response.data.user;
					if (dbUuid) {
						this.companyService.setTenant(dbUuid);
					}
					this.userDetailsToCompany(true);
					this.confirmationPopup('Enlisted Successfully');
				}
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
				this.user = response.data.user;
				this.userForm.setValue({
					id: response.data.user.id,
					username: response.data.user.username,
					password: response.data.user.password,
					confirmPassword: response.data.user.password,
					firstName: response.data.user.firstName,
					lastName: response.data.user.lastName,
					email: response.data.user.email,
					enabled: response.data.user.enabled,
					roles: response.data.user.roles,
					deleteFlag: response.data.user.deleteFlag,
				});
				this.role = response.data.user.roles[0];
				localStorage.setItem('edit-username', this.user.username);
			}
		});
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
