import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomValidationService } from 'src/app/authentication/services/custom-validation.service';
import Swal from 'sweetalert2';

@Component({
	selector: 'app-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.css'],
})
export class ResetPasswordComponent implements OnInit {
	@ViewChild('resetPasswordTemplate') resetPasswordTemplate: TemplateRef<any>;
	@Output() resetPasswordEvent = new EventEmitter();

	showOldPassword: boolean = false;
	showNewPassword: boolean = false;
	showNewConfirmPassword: boolean = false;

	resetPasswordForm: FormGroup;

	constructor(private _snackBar: MatSnackBar, private customValidationService: CustomValidationService, private modalService: NgbModal) {}

	ngOnInit(): void {
		this.formInIt();
	}

	@Input()
	set openResetPasswordModal(data: any) {
		if (data) {
			this.openModal(this.resetPasswordTemplate);
		}
	}

	formInIt() {
		this.resetPasswordForm = new FormGroup(
			{
				oldPassword: new FormControl(null, [Validators.required, this.customValidationService.patternValidator]),
				newPassword: new FormControl(null, [Validators.required, this.customValidationService.patternValidator]),
				confirmNewPassword: new FormControl(null, Validators.required),
			},
			{
				validators: this.customValidationService.MatchPassword('newPassword', 'confirmNewPassword'),
			}
		);
	}

	openModal(template: TemplateRef<any>) {
    this.formInIt()
		setTimeout(() => {
			this.modalService.open(template, { size: 'lg' });
		});
	}

	resetPassword() {
		if (this.resetPasswordForm.valid) {
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

	oldPassword() {
		this.showOldPassword = !this.showOldPassword;
	}

	newPassword() {
		this.showNewPassword = !this.showNewPassword;
	}

	confirmNewPassword() {
		this.showNewConfirmPassword = !this.showNewConfirmPassword;
	}
}
