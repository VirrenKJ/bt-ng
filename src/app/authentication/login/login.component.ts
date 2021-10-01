import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import * as EventEmitter from 'events';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CustomValidationService } from '../services/custom-validation.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  setNameOfUserEvent = new EventEmitter();

  constructor(
    private customValidationService: CustomValidationService,
    private _snackBar: MatSnackBar,
    private loginService: LoginService,
    private router: Router,
    private ngxService: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl(null, [Validators.required, this.customValidationService.noWhitespace]),
      password: new FormControl(null, [Validators.required, this.customValidationService.noWhitespace]),
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      // this.ngxService.startLoader('master');
      // this.ngxService.stopLoader('master');
      this.loginService.authenticate(this.loginForm.value).subscribe(
        (response: any) => {
          console.log(response);
          this.loginService.setToken(response.token);
        },
        errorRes => {
          console.error(errorRes);
          this.snackBarPopup(errorRes.error.message);
        },
        () => {
          this.getCurrentUser();
          this.router.navigate(['main']);
          this.setNameOfUserEvent.emit(null);
        }
      );
    } else {
      this.snackBarPopup('Invalid Credentials');
    }
  }

  getCurrentUser() {
    this.loginService.getCurrentUser().subscribe(
      (response: any) => {
        this.loginService.setUser(response);
        console.log(response);
      },
      errorRes => {
        console.error(errorRes.error);
        this.snackBarPopup(errorRes.error.message);
      }
    );
  }

  snackBarPopup(message: string) {
    this._snackBar.open(message, 'OK', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
