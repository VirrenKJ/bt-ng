import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'bt';
  loggedIn = false;
  logIn = true;

  switchLogin() {
    this.logIn = !this.logIn;
  }

  login() {
    this.loggedIn = true;
    console.log(this.loggedIn);
  }
}
