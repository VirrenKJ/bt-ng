import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../common/models/user';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  user: User;

  constructor() {}

  ngOnInit(): void {
    this.init();
  }

  init() {
    this.user = new User();
    this.signupForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      confirmPassword: new FormControl(null, Validators.required),
      userData: new FormGroup({
        firstName: new FormControl(null, Validators.required),
        lastName: new FormControl(null, Validators.required),
        email: new FormControl(null, [Validators.required, Validators.email]),
      }),
    });
    this.signupForm.get('userData.email').valueChanges.subscribe(value => {
      console.log(value);
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      console.log('*****VALID*****', this.signupForm);
    } else {
      console.log('*****INVALID*****', this.signupForm);
    }
    this.signupForm.reset();
  }
}
