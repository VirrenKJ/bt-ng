import { UserDetail } from './../../authentication/common/models/user-detail';
import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Role } from 'src/app/authentication/common/models/role';
import { LoginService } from 'src/app/authentication/services/login.service';
import { RoleService } from 'src/app/authentication/services/role.service';
import { UserService } from 'src/app/authentication/services/user.service';
import { PaginationCriteria } from 'src/app/base/models/pagination_criteria';
import Swal from 'sweetalert2';
import { Company } from '../models/company';
import { CompanyService } from '../services/company.service';
import { User } from 'src/app/authentication/common/models/user';

@Component({
  selector: 'app-enlist-modal',
  templateUrl: './enlist-modal.component.html',
  styleUrls: ['./enlist-modal.component.css'],
})
export class EnlistModalComponent implements OnInit {
  @ViewChild('enlistEmployee') enlistEmployee: TemplateRef<any>;
  @Output() employeeListing = new EventEmitter();

  companies = new Array<Company>();
  users = new Array<User>();
  roles = new Array<Role>();
  company = new Company();
  userDetail = new UserDetail();
  role = new Role();

  searchFor: string;

  constructor(
    private modalService: NgbModal,
    private companyService: CompanyService,
    private roleService: RoleService,
    private loginService: LoginService,
    private userService: UserService,
    private _snackBar: MatSnackBar
  ) {}

  @Input()
  set openEnlistingModal(data: any) {
    if (data) {
      this.openModal();
    }
  }

  ngOnInit(): void {}

  openModal() {
    this.onInit();
    setTimeout(() => {
      this.modalService.open(this.enlistEmployee, { size: 'lg' });
    });
  }

  onInit() {
    this.getCompanies();
    this.getRoles();
    this.users = new Array<User>();
    this.company = new Company();
    this.userDetail = new UserDetail();
    this.role = new Role();
    this.searchFor = '';
  }

  getCompanies() {
    let paginationCriteria = new PaginationCriteria();
    paginationCriteria.id = this.loginService.getUser().id;
    this.companyService.getList(paginationCriteria).subscribe(
      response => {
        console.log(response);
        if (response.data && response.data.company && response.data.company.list) {
          this.companies = response.data.company.list;
        }
      },
      errorRes => {
        console.error(errorRes);
        this.snackBarPopup(errorRes?.error?.message);
      }
    );
  }

  getRoles() {
    let paginationCriteria = new PaginationCriteria();
    this.roleService.getList(paginationCriteria).subscribe(
      response => {
        if (response.data && response.data.role) {
          this.roles = response.data.role;
        }
      },
      errorRes => {
        console.error(errorRes);
      }
    );
  }

  getUsers() {
    let paginationCriteria = new PaginationCriteria();
    paginationCriteria.limit = 10;
    paginationCriteria.page = 1;
    paginationCriteria.id = this.loginService.getUser().id;
    paginationCriteria.searchFor = this.searchFor;
    this.userService.getList(paginationCriteria).subscribe(
      response => {
        if (response.data.user.list) {
          this.users = response.data.user.list;
        }
      },
      errorRes => {
        console.error(errorRes);
        this.snackBarPopup(errorRes?.error?.message);
      }
    );
  }

  selectedUser(userDetail) {
    console.log(userDetail);
    this.userDetail = userDetail;
  }

  onSubmit() {
    if (!this.company.userDetails) {
      this.company.userDetails = new Array<UserDetail>();
    }
    this.company.userDetails.push(this.setUserDetail());
    console.log(this.company);
    this.companyService.update(this.company).subscribe(
      response => {
        console.log(response);
        this.userDetailsToCompany();
        this.confirmationPopup();
      },
      errorRes => {
        console.error(errorRes);
        this.snackBarPopup(errorRes?.error?.message);
      }
    );
  }

  userDetailsToCompany() {
    if (this.userDetail['authorities']) {
      this.userDetail['authorities'] = null;
    }
    this.userService.addUserDetailsToCompany(this.userDetail, this.company.dbUuid).subscribe(response => {
      console.log(response);
    });
  }

  setUserDetail() {
    let userDetail = new UserDetail();
    userDetail.id = this.userDetail.id;
    userDetail.roles.push(this.role);
    return userDetail;
  }

  snackBarPopup(message: string) {
    this._snackBar.open(message, 'OK', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  confirmationPopup() {
    Swal.fire({
      icon: 'success',
      title: 'Enlisted Successfully',
      showConfirmButton: false,
      timer: 2000,
    }).then(() => {
      this.employeeListing.emit();
      this.modalService.dismissAll();
    });
  }
}
