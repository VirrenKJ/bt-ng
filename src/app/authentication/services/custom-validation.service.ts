import { CompanyService } from 'src/app/company-listing/services/company.service';
import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { User } from '../common/models/user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class CustomValidationService {

  constructor(private userService: UserService, private companyService: CompanyService) {}

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
    return new Promise(resolve => {
      setTimeout(() => {
        let dbUuid = this.companyService.temporarilyRemoveTenant();
        this.userService.getByUsername(userControl.value.trim()).subscribe(
          response => {
            console.log(response);
            let user: User = response.data.user;
            if (user) {
              if (this.editUsername(user.username)) {
                resolve(null);
              } else {
                resolve({ usernameNotAvailable: true });
              }
            } else {
              resolve(null);
            }
          },
          errorRes => {
            console.error(errorRes.error);
          }
        );
        if (dbUuid) {
          this.companyService.setTenant(dbUuid);
        }
      });
    });
  }

  editUsername(username: string) {
    const editUsername = localStorage.getItem('edit-username');
    if (editUsername === undefined || editUsername === null || editUsername === '') {
      return false;
    } else if (username != editUsername) {
      return false;
    } else {
      return true;
    }
  }

  emailValidator(userControl: AbstractControl) {
    return new Promise(resolve => {
      setTimeout(() => {
        let dbUuid = this.companyService.temporarilyRemoveTenant();
        this.userService.getByEmail(userControl.value.trim()).subscribe(
          response => {
            console.log(response);
            let user: User = response.data.user;
            if (user) {
              if (this.editEmail(user.email)) {
                resolve(null);
              } else {
                resolve({ emailNotAvailable: true });
              }
            } else {
              resolve(null);
            }
          },
          errorRes => {
            console.error(errorRes.error);
          }
        );
        if (dbUuid) {
          this.companyService.setTenant(dbUuid);
        }
      });
    });
  }

  editEmail(email: string) {
    const editEmail = localStorage.getItem('edit-email');
    if (editEmail === undefined || editEmail === null || editEmail === '') {
      return false;
    } else if (email != editEmail) {
      return false;
    } else {
      return true;
    }
  }
}
