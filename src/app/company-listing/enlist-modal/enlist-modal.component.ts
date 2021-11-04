import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/authentication/common/models/user';
import { Company } from '../models/company';

@Component({
	selector: 'app-enlist-modal',
	templateUrl: './enlist-modal.component.html',
	styleUrls: ['./enlist-modal.component.css'],
})
export class EnlistModalComponent implements OnInit {
	@ViewChild('enlistEmployee') enlistEmployee: TemplateRef<any>;

	companies = new Array<Company>();
	users = new Array<User>();
	enlistForm: FormGroup;

	constructor(private modalService: NgbModal) {}

	ngOnInit(): void {
		this.enlistForm = new FormGroup({
			company: new FormControl(null, Validators.required),
			user: new FormGroup({
				id: new FormControl(null, Validators.required),
			}),
		});
	}

	@Input()
	set openEnlistingModal(data: any) {
		if (data) {
			this.openModal();
		}
	}

	openModal() {
		setTimeout(() => {
			// this.companyFormDirective.resetForm();
			this.modalService.open(this.enlistEmployee, { size: 'md' });
		});
	}

	getCompanies() {}

	getUsers() {}
}
