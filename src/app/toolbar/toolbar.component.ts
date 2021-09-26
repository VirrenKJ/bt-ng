import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import Swal from 'sweetalert2';
import { LoginService } from '../authentication/services/login.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent implements OnInit {
  @Output() loggedOutEvent = new EventEmitter<any>();
  @Input() setLoggedIn;

  constructor(private loginService: LoginService) {}

  ngOnInit(): void {}

  logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Logout',
    }).then(value => {
      if (value.isConfirmed) {
        this.loginService.logout();
        this.loggedOutEvent.emit();
      }
    });
  }
}
