import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { SearchCriteriaObj } from 'src/app/base/models/search_criteria_obj';
import { User } from '../common/models/user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class CustomValidationService {
  usernameList = new Array<string>();

  constructor(private userService: UserService) {
    this.userService.getList(new SearchCriteriaObj()).subscribe(
      response => {
        response.data.user.forEach(user => {
          this.usernameList.push(user.username);
        });
        console.log(this.usernameList);
      },
      errorRes => {
        console.error(errorRes.error);
      },
      () => {}
    );
  }

  patternValidator(control: AbstractControl) {
    if (!control.value) {
      return null;
    }
    //The password should be a minimum of eight characters long
    //It has at least one lower case letter, one upper case letter, one number
    const regex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$');
    const valid = regex.test(control.value);
    return valid ? null : { invalidPassword: true };
  }

  MatchPassword(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];

      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }

      if (confirmPasswordControl.errors && !confirmPasswordControl.errors.passwordMismatch) {
        return null;
      }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    };
  }

  noWhitespace(control: AbstractControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  usernameValidator(userControl: AbstractControl) {
    if (!userControl.value) {
      return null;
    }
    if (this.validateUserName(userControl.value)) {
      return { userNameNotAvailable: true };
    } else {
      return null;
    }
  }

  validateUserName(userName: string): any {
    return this.usernameList.indexOf(userName) > -1;
  }
}
