import { Component, OnInit } from '@angular/core';
import { LoginService } from './authentication/services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  // loggedIn = false;
  // showLogIn = true;

  constructor(private loginService: LoginService) {}

  ngOnInit(): void {}

  // switchLoginSignup() {
  //   this.showLogIn = !this.showLogIn;
  // }

  // login() {
  //   this.loggedIn = this.loginService.isLoggedIn();
  // }

  // logout() {
  //   this.loggedIn = this.loginService.isLoggedIn();
  // }
}
