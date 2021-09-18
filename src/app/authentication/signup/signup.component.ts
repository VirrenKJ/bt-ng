import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { SearchCriteriaObj } from 'src/app/base/models/search_criteria_obj';
import { Role } from '../common/models/role';
import { User } from '../common/models/user';
import { RoleService } from '../services/role.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  @ViewChild(FormGroupDirective) signupFormDirective: FormGroupDirective;
  signupForm: FormGroup;
  roles = new Array<Role>();

  constructor(private userService: UserService, private roleService: RoleService) {}

  ngOnInit(): void {
    this.init();
    this.getRoles();
  }

  init() {
    this.signupForm = new FormGroup(
      {
        username: new FormControl(null, Validators.required),
        password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
        confirmPassword: new FormControl(null, Validators.required),
        firstName: new FormControl(null, Validators.required),
        lastName: new FormControl(null, Validators.required),
        email: new FormControl(null, [Validators.required, Validators.email]),
        enabled: new FormControl(true),
        roles: new FormControl(null, Validators.required),
      },
      {
        validators: this.mustMatch('password', 'confirmPassword'),
      }
    );
    this.signupForm.get('username').valueChanges.subscribe(value => {
      console.log(value);
    });
  }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return null;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  getRoles() {
    this.roleService.getList(new SearchCriteriaObj()).subscribe(
      response => {
        console.log(response);
        this.roles = response.data.role;
        console.log(this.roles);
      },
      error => {
        console.log(error);
      }
    );
  }

  onSubmit() {
    if (this.signupForm.valid) {
      //add role
      let roles = new Array<Role>();
      let role = new Role();
      role.roleId = this.signupForm.get('roles').value;
      roles.push(role);
      this.signupForm.get('roles').patchValue(roles);

      //post user
      this.userService.addUser(this.signupForm.value).subscribe(
        response => {
          console.log(response);
          alert('Success');
        },
        error => {
          console.log(error);
          alert('Something went wrong');
        }
      );
      this.signupForm.reset();
      setTimeout(() => {
        this.signupFormDirective.resetForm();
      });
    } else {
      alert('Invalid Form');
      setTimeout(() => {
        this.signupFormDirective.resetForm();
      });
    }
  }
}
