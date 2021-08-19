import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-profile-modal',
  templateUrl: './add-profile-modal.component.html',
  styleUrls: ['./add-profile-modal.component.css'],
  providers: [NgbModalConfig, NgbModal],
})
export class AddProfileModalComponent implements OnInit {
  @ViewChild('addProfile') addProfile: TemplateRef<any>;

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {}

  @Input()
  set openProfileModal(data: any) {
    if (data && !data.profileId) {
      this.openModal(this.addProfile);
    }
    if (data && data.profileId) {
      this.openModal(this.addProfile, data.profileId);
    }
  }

  openModal(template: TemplateRef<any>, profileId = null) {
    setTimeout(() => {
      this.modalService.open(template, { size: 'lg' });
    });
  }

  contactForm = new FormGroup({
    firstName: new FormControl(),
    lastName: new FormControl(),
    email: new FormControl(),
    gender: new FormControl(),
    isMarried: new FormControl(),
    country: new FormControl(),
  });

  onSubmit() {
    console.log('Submitted!');
  }
}
