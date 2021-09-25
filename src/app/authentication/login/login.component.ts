import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomValidationService } from '../services/custom-validation.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  @Output() signupEvent = new EventEmitter<any>();
  @Output() tempLoginEvent = new EventEmitter<any>();

  loginForm: FormGroup;

  constructor(private customValidationService: CustomValidationService, private _snackBar: MatSnackBar, private loginService: LoginService) {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl(null, [Validators.required, this.customValidationService.noWhitespace]),
      password: new FormControl(null, [Validators.required, this.customValidationService.noWhitespace]),
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
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
        }
      );
    } else {
      this.snackBarPopup('Invalid Credentials');
    }

    // this.emitTempLoginEvent();
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

  emitSignupEvent() {
    this.signupEvent.emit();
  }

  emitTempLoginEvent() {
    this.tempLoginEvent.emit();
  }
}
