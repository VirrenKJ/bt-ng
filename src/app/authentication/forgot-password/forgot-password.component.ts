import { UserService } from './../services/user.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit {
	@ViewChild(FormGroupDirective) emailFormDirective: FormGroupDirective;
	emailForm: FormGroup;

	constructor(private userService: UserService, private _snackBar: MatSnackBar) {}

	ngOnInit(): void {
		this.emailForm = new FormGroup({
			email: new FormControl(null, [Validators.required, Validators.email]),
		});
	}

	onSubmit() {
		console.log(this.emailForm.get('email').value);
		if (this.emailForm.valid) {
			this.userService.sendToken(this.emailForm.get('email').value).subscribe(
				response => {
					console.log(response);
					if (response.status == 200 && response.data && response.data.tokenSend) {
						this.snackBarPopup('Token sent, check your mail.');
						this.emailFormDirective.resetForm();
					} else if (response.status == 404 && response.code == 'GEX002') {
						this.snackBarPopup(response?.message);
						this.emailFormDirective.resetForm();
					}
				},
				errorRes => {
					console.log(errorRes);
					this.snackBarPopup(errorRes?.error?.message);
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
}
