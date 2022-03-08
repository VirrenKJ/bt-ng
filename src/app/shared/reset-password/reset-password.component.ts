import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomValidationService } from 'src/app/authentication/services/custom-validation.service';
import { UserService } from 'src/app/authentication/services/user.service';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
	@ViewChild('resetPasswordTemplate') resetPasswordTemplate: TemplateRef<any>;
	@Output() resetPasswordEvent = new EventEmitter();

	showCurrentPassword: boolean = false;
	showNewPassword: boolean = false;
	showNewConfirmPassword: boolean = false;

	resetPasswordForm: FormGroup;
	userId: number;

	constructor(
		private _snackBar: MatSnackBar,
		private customValidationService: CustomValidationService,
		private modalService: NgbModal,
		private userService: UserService
	) {}

	ngOnInit(): void {
		this.formInIt();
	}

	@Input()
	set openResetPasswordModal(data: any) {
		if (data && data.userId) {
			this.userId = data.userId;
			console.log(this.userId);

			this.showCurrentPassword = false;
			this.showNewPassword = false;
			this.showNewConfirmPassword = false;
			this.openModal(this.resetPasswordTemplate);
		}
	}

	formInIt() {
		this.resetPasswordForm = new FormGroup(
			{
				userId: new FormControl(),
				currentPassword: new FormControl(null, [Validators.required, this.customValidationService.patternValidator]),
				newPassword: new FormControl(null, [Validators.required, this.customValidationService.patternValidator]),
				confirmNewPassword: new FormControl(null, Validators.required),
			},
			{
				validators: this.customValidationService.MatchPassword('newPassword', 'confirmNewPassword'),
			}
		);
	}

	openModal(template: TemplateRef<any>) {
		this.formInIt();
		setTimeout(() => {
			this.modalService.open(template, { size: 'xl' });
		});
	}

	resetPassword() {
		if (this.resetPasswordForm.valid) {
			this.resetPasswordForm.get('userId').patchValue(this.userId);
			this.userService.resetPassword(this.resetPasswordForm.value).subscribe(response => {
				if (response.status == 200 && response.data && response.data.passwordReset) {
					this.confirmationPopup('Password Changed');
				} else if (response.status == 400 && response.data && !response.data.passwordReset) {
					this.snackBarPopup(response.message);
				}
			});
		} else {
			this.snackBarPopup('Invalid Form');
		}
	}

	confirmationPopup(title: string) {
		Swal.fire({
			icon: 'success',
			title: title,
			showConfirmButton: false,
			timer: 2000,
		}).then(() => {
			this.resetPasswordEvent.emit();
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

	currentPassword() {
		this.showCurrentPassword = !this.showCurrentPassword;
	}

	newPassword() {
		this.showNewPassword = !this.showNewPassword;
	}

	confirmNewPassword() {
		this.showNewConfirmPassword = !this.showNewConfirmPassword;
	}
}
