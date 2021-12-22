import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-project-modal',
  templateUrl: './add-project-modal.component.html',
  styleUrls: ['./add-project-modal.component.css'],
  providers: [NgbModalConfig, NgbModal],
})
export class AddProjectModalComponent implements OnInit {
  @ViewChild('addProject') addProject: TemplateRef<any>;

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {}

  @Input()
  set openProjectModal(data: any) {
    if (data && !data.projectId) {
      this.openModal(this.addProject);
    }
    if (data && data.projectId) {
      this.openModal(this.addProject, data.projectId);
    }
  }

  openModal(template: TemplateRef<any>, projectId = null) {
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
