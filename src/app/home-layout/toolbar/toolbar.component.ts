import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import Swal from 'sweetalert2';
import { LoginService } from '../../authentication/services/login.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent implements OnInit {
  nameOfUser: string = '';

  constructor(private loginService: LoginService, private router: Router, private ngxService: NgxUiLoaderService) {}

  ngOnInit(): void {}

  afterLogin() {
    this.nameOfUser = this.loginService.getUser()?.firstName;
  }

  logout() {
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
        this.ngxService.startLoader('master');
        this.loginService.logout();
        this.router.navigate(['user/login']);
        this.ngxService.stopLoader('master');
      }
    });
  }
}
