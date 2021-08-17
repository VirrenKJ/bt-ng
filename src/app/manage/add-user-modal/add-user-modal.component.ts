import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-add-user-modal',
  templateUrl: './add-user-modal.component.html',
  styleUrls: ['./add-user-modal.component.css'],
})
export class AddUserModalComponent implements OnInit {
  @ViewChild('addUser') addUser: TemplateRef<any>;

  modalRef: BsModalRef;

  constructor(private modalService: BsModalService) {}

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
      //@ts-ignore
      this.modalRef = this.modalService.show(template, Object.assign({ backdrop: 'static' }, { class: 'gray modal-md' }));
    });
  }
}
