import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-issue',
  templateUrl: './add-issue.component.html',
  styleUrls: ['./add-issue.component.css'],
})
export class AddIssueComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  contactForm = new FormGroup({
    firstName: new FormControl(),
    lastName: new FormControl(),
    email: new FormControl(),
    gender: new FormControl(),
    isMarried: new FormControl(),
    country: new FormControl(),
  });

  countryList = [
    {
      id: 1,
      name: 'India',
    },
    {
      id: 2,
      name: 'Sri Lanka',
    },
    {
      id: 3,
      name: 'Bangladesh',
    },
  ];

  onSubmit() {
    console.log('Submitted!');
  }
}
