import { UserService } from './../../authentication/services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { User } from 'src/app/authentication/common/models/user';
import { CompanyService } from 'src/app/company-listing/services/company.service';
import Swal from 'sweetalert2';
import { LoginService } from '../../authentication/services/login.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent implements OnInit {
  nameOfUser: string = '';
  user = new User();

  setOpenUserModal: any;
  setOpenChangePasswordModal: any;

  constructor(
    private loginService: LoginService,
    private userService: UserService,
    private router: Router,
    private ngxService: NgxUiLoaderService,
    private companyService: CompanyService
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  getUser() {
    setTimeout(() => {
      this.user = this.loginService.getUser();
      this.nameOfUser = this.user?.firstName;
    });
  }

  openUserModal() {
    this.setOpenUserModal = {
      userId: this.user.id,
    };
  }

  openChangePasswordModal() {
    this.setOpenChangePasswordModal = {
      userId: this.user.id,
    };
  }

  getUserDetails() {
    this.userService.getById(this.user.id).subscribe(response => {
      if (response.status === 200 && response.data && response.data.user) {
        this.loginService.setUser(response.data.user);
        window.location.reload();
      }
    });
  }

  passwordChange() {
    this.logout();
  }

  exitBugTracker() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be redirected to Company Listings!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Exit',
    }).then(result => {
      if (result.isConfirmed) {
        this.companyService.exitBugTracker();
        this.router.navigate(['companies']);
      }
    });
  }

  logoutConfirmation() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Log out',
    }).then(result => {
      if (result.isConfirmed) {
        this.logout();
      }
    });
  }

  logout() {
    this.ngxService.startLoader('master');
    this.loginService.logout();
    this.companyService.exitBugTracker();
    this.router.navigate(['user/login']);
    this.ngxService.stopLoader('master');
  }
}
