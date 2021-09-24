import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  @Output() signupEvent = new EventEmitter<any>();
  @Output() tempLoginEvent = new EventEmitter<any>();

  loginForm: FormGroup;

  constructor() {}

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    });
  }

  onSubmit() {}

  emitSignupEvent() {
    this.signupEvent.emit();
  }

  emitTempLoginEvent() {
    this.tempLoginEvent.emit();
  }
}
