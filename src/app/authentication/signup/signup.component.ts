import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SearchCriteriaObj } from 'src/app/base/models/search_criteria_obj';
import Swal from 'sweetalert2';
import { Role } from '../common/models/role';
import { CustomValidationService } from '../services/custom-validation.service';
import { RoleService } from '../services/role.service';
import { UserService } from '../services/user.service';

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
	@ViewChild(FormGroupDirective) signupFormDirective: FormGroupDirective;

	roles = new Array<Role>();
	showPassword: boolean = false;
	showConfirmPassword: boolean = false;

	signupForm: FormGroup;

	constructor(
		private userService: UserService,
		private roleService: RoleService,
		private _snackBar: MatSnackBar,
		private customValidationService: CustomValidationService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.init();
		this.getRoles();
	}

	init() {
		this.signupForm = new FormGroup(
			{
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
				roles: new FormControl(null, Validators.required),
			},
			{
				validators: this.customValidationService.MatchPassword('password', 'confirmPassword'),
			}
		);
		this.signupForm.get('username').valueChanges.subscribe(value => {
			console.log(value, this.signupForm.get('username').errors);
		});
	}

	getRoles() {
		this.roles = [
			{
				roleId: 1,
				roleName: 'Admin',
				description: '',
				deleteFlag: false,
			},
			{
				roleId: 2,
				roleName: 'Developer',
				description: '',
				deleteFlag: false,
			},
		];
		// this.roleService.getList(new SearchCriteriaObj()).subscribe(
		// 	response => {
		// 		console.log(response);
		// 		this.roles = response.data.role;
		// 		console.log(this.roles);
		// 	},
		// 	error => {
		// 		console.log(error);
		// 	}
		// );
	}

	onSubmit() {
		if (this.signupForm.valid) {
			//add role
			let roles = new Array<Role>();
			let role = new Role();
			role.roleId = this.signupForm.get('roles').value;
			roles.push(role);
			this.signupForm.get('roles').patchValue(roles);

			//remove whitespace
			this.signupForm.get('username').setValue(this.signupForm.get('username').value.trim());
			this.signupForm.get('firstName').setValue(this.signupForm.get('firstName').value.trim());
			this.signupForm.get('lastName').setValue(this.signupForm.get('lastName').value.trim());
			this.signupForm.get('email').setValue(this.signupForm.get('email').value.trim());

			// post user
			this.userService.add(this.signupForm.value).subscribe(
				response => {
					console.log(response);
					this.confirmationPopup();
				},
				errorRes => {
					console.log(errorRes);
					this.snackBarPopup(errorRes.error.message);
				},
				() => {
					// this.signupFormDirective.resetForm();
				}
			);
		} else {
			this.snackBarPopup('Invalid Form');
		}
	}

	snackBarPopup(message: string) {
		this._snackBar.open(message, 'OK', {
			duration: 3000,
			horizontalPosition: 'center',
			verticalPosition: 'top',
		});
	}

	confirmationPopup() {
		Swal.fire({
			icon: 'success',
			title: 'User Registered',
			showConfirmButton: false,
			timer: 2000,
		}).then(() => {
			this.router.navigate(['user/login']);
		});
	}

	password() {
		this.showPassword = !this.showPassword;
	}

	confirmPassword() {
		this.showConfirmPassword = !this.showConfirmPassword;
	}
}
