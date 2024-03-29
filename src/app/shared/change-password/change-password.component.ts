import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomValidationService } from 'src/app/authentication/services/custom-validation.service';
import { UserService } from 'src/app/authentication/services/user.service';
import { CompanyService } from 'src/app/company-listing/services/company.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  @ViewChild('changePasswordTemplate') changePasswordTemplate: TemplateRef<any>;
  @Output() changePasswordEvent = new EventEmitter();

  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showNewConfirmPassword: boolean = false;

  changePasswordForm: FormGroup;
  userId: number;

  constructor(
    private _snackBar: MatSnackBar,
    private customValidationService: CustomValidationService,
    private modalService: NgbModal,
    private companyService: CompanyService,
    private userService: UserService
  ) {}

  @Input()
  set openChangePasswordModal(data: any) {
    if (data && data.userId) {
      this.userId = data.userId;
      console.log(this.userId);

      this.showCurrentPassword = false;
      this.showNewPassword = false;
      this.showNewConfirmPassword = false;
      this.openModal(this.changePasswordTemplate);
    }
  }

  ngOnInit(): void {
    this.formInIt();
  }

  formInIt() {
    this.changePasswordForm = new FormGroup(
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

  changePassword() {
    if (this.changePasswordForm.valid) {
      this.changePasswordForm.get('userId').patchValue(this.userId);
      let dbUuid = this.companyService.temporarilyRemoveTenant();
      this.userService.changePassword(this.changePasswordForm.value).subscribe(
        response => {
          if (response.status == 200 && response.data && response.data.passwordChange) {
            this.confirmationPopup('Password Changed');
          } else if (response.status == 400 && response.data && !response.data.passwordChange) {
            this.snackBarPopup(response.message);
          }
        },
        errorRes => {
          console.error(errorRes);
        }
      );
      if (dbUuid) {
        this.companyService.setTenant(dbUuid);
      }
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
      this.changePasswordEvent.emit();
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
