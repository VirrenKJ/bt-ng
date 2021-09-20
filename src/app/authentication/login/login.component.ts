import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  @Output() signupEvent = new EventEmitter<any>();
  @Output() tempLoginEvent = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  emitSignupEvent() {
    this.signupEvent.emit();
  }

  emitTempLoginEvent() {
    this.tempLoginEvent.emit();
  }
}
