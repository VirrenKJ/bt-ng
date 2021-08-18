import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-add-category-modal',
  templateUrl: './add-category-modal.component.html',
  styleUrls: ['./add-category-modal.component.css'],
  providers: [NgbModalConfig, NgbModal],
})
export class AddCategoryModalComponent implements OnInit {
  @ViewChild('addCategory') addCategory: TemplateRef<any>;

  constructor(config: NgbModalConfig, private modalService: NgbModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {}

  @Input()
  set openCategoryModal(data: any) {
    if (data && !data.categoryId) {
      this.openModal(this.addCategory);
    }
    if (data && data.categoryId) {
      this.openModal(this.addCategory, data.categoryId);
    }
  }

  openModal(template: TemplateRef<any>, categoryId = null) {
    setTimeout(() => {
      this.modalService.open(template, { size: 'lg' });
    });
  }
}
