import { PasswordReset } from './../../shared/models/password-reset';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroupDirective, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ForgotPassword } from '../common/models/forgot-password';
import { CustomValidationService } from '../services/custom-validation.service';
import { UserService } from '../services/user.service';

@Component({
	selector: 'app-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
	@ViewChild(FormGroupDirective) forgotPasswordFormDirective: FormGroupDirective;
	forgotPassword = new ForgotPassword();

	token: any;
	forgotPasswordForm: FormGroup;
	showPassword: boolean = false;
	tokenValidation: boolean = false;
	showConfirmPassword: boolean = false;

	constructor(
		private userService: UserService,
		private _snackBar: MatSnackBar,
		private customValidationService: CustomValidationService,
		private activatedRoute: ActivatedRoute,
		private router: Router
	) {}

	ngOnInit(): void {
		this.init();
		this.activatedRoute.params.subscribe(params => {
			if (params['token']) {
				this.token = params['token'];
				console.log(this.token);

				this.validatePasswordResetToken();
			} else {
				this.router.navigate(['user/login']);
			}
		});
	}

	init() {
		this.forgotPasswordForm = new FormGroup(
			{
				token: new FormControl(null),
				newPassword: new FormControl(null, [Validators.required, this.customValidationService.patternValidator]),
				confirmNewPassword: new FormControl(null, Validators.required),
			},
			{
				validators: this.customValidationService.MatchPassword('newPassword', 'confirmNewPassword'),
			}
		);
	}

	validatePasswordResetToken() {
		this.userService.validatePasswordResetToken(this.token).subscribe(response => {
			if (response.status == 200 && !response.data.validateToken) {
				this.tokenValidation = true;
			} else if (response.status == 400 && response.data.validateToken) {
				this.tokenValidation = false;
				this.confirmationPopup(response?.data?.validateToken, 'Send an another token.');
			}
		});
	}

	onSubmit() {
		if (this.forgotPasswordForm.valid) {
			this.forgotPasswordForm.get('token').setValue(this.token);
      console.log(this.forgotPasswordForm.value);
      
			this.userService.resetPassword(this.forgotPasswordForm.value).subscribe(response => {
        console.log(response);
        
				if (response.status == 200 && response.data && response.data.resetPassword) {
					this.passwordResetConfirmation();
				}
			});
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

	confirmationPopup(title, text) {
		Swal.fire({
			icon: 'error',
			title: title,
			text: text,
			showConfirmButton: true,
		}).then(() => {
			this.router.navigate(['user/forgot-password']);
		});
	}

	passwordResetConfirmation() {
		Swal.fire({
			icon: 'success',
			title: 'Password Changed',
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
