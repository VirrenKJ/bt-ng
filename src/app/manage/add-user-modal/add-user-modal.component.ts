import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-user-modal',
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['./add-user-modal.component.css'],
  providers: [NgbModalConfig, NgbModal],
})
export class AddUserModalComponent implements OnInit {
  @ViewChild('addUser') addUser: TemplateRef<any>;

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {}

  @Input()
  set openUserModal(data: any) {
    if (data && !data.userId) {
      this.openModal(this.addUser);
    }
    if (data && data.userId) {
      this.openModal(this.addUser, data.userId);
    }
  }

  openModal(template: TemplateRef<any>, userId = null) {
    setTimeout(() => {
      this.modalService.open(template, { size: 'lg' });
    });
  }
}
