import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SearchCriteriaObj } from 'src/app/base/models/search_criteria_obj';
import Swal from 'sweetalert2';
import { Role } from '../common/models/role';
import { CustomValidationService } from '../services/custom-validation.service';
import { RoleService } from '../services/role.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  @ViewChild(FormGroupDirective) signupFormDirective: FormGroupDirective;
  @Output() showLoginEvent = new EventEmitter<any>();
  roles = new Array<Role>();
  signupForm: FormGroup;

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private _snackBar: MatSnackBar,
    private customValidationService: CustomValidationService
  ) {}

  ngOnInit(): void {
    this.init();
    this.getRoles();
  }

  init() {
    this.signupForm = new FormGroup(
      {
        username: new FormControl(null, [Validators.required, this.customValidationService.noWhitespace]),
        password: new FormControl(null, [Validators.required, this.customValidationService.patternValidator]),
        confirmPassword: new FormControl(null, Validators.required),
        firstName: new FormControl(null, [Validators.required, this.customValidationService.noWhitespace]),
        lastName: new FormControl(null, [Validators.required, this.customValidationService.noWhitespace]),
        email: new FormControl(null, [Validators.required, Validators.email]),
        enabled: new FormControl(true),
        roles: new FormControl(null, Validators.required),
      },
      {
        validators: this.customValidationService.MatchPassword('password', 'confirmPassword'),
      }
    );
    this.signupForm.get('username').valueChanges.subscribe(value => {
      console.log(value);
    });
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
          Swal.fire('Success', 'User Registered', 'success').then(value => {
            if (value.isConfirmed) {
              this.emitLoginEvent();
            }
          });
        },
        errorRes => {
          console.log(errorRes);
          this.snackBarPopup(errorRes.error.message);
        },
        () => {
          this.signupFormDirective.resetForm();
        }
      );
    } else {
      // Swal.fire('Success', 'User Registered', 'success');
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

  emitLoginEvent() {
    this.showLoginEvent.emit();
  }
}
