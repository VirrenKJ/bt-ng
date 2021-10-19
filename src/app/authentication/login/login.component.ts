import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CustomValidationService } from '../services/custom-validation.service';
import { LoginService } from '../services/login.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
	loginForm: FormGroup;

	constructor(
		private customValidationService: CustomValidationService,
		private _snackBar: MatSnackBar,
		private loginService: LoginService,
		private router: Router
	) {}

	ngOnInit(): void {
		this.loginForm = new FormGroup({
			username: new FormControl(null, [Validators.required, this.customValidationService.noWhitespace]),
			password: new FormControl(null, [Validators.required, this.customValidationService.noWhitespace]),
		});
	}

	onSubmit() {
		// this.loginService.setTokenAndUser({
		// 	token: 'temporaryLogin',
		// 	user: {
		// 		roles: {
		// 			roleName: 'Admin',
		// 		},
		// 	},
		// });
		// this.router.navigate(['companies']);
		if (this.loginForm.valid) {
			this.loginService.authenticate(this.loginForm.value).subscribe(
				(response: any) => {
					console.log(response);
					this.loginService.setTokenAndUser(response);
				},
				errorRes => {
					console.error(errorRes);
					this.snackBarPopup(errorRes.error.message);
				},
				() => {
					this.router.navigate(['companies']);
				}
			);
		} else {
			this.snackBarPopup('Invalid Credentials');
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
