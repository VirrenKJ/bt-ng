import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/authentication/common/models/user';
import { LoginService } from 'src/app/authentication/services/login.service';
import { UserService } from 'src/app/authentication/services/user.service';
import { SearchCriteriaObj } from 'src/app/base/models/search_criteria_obj';
import { SearchFieldObj } from 'src/app/base/models/search_field_obj';
import { Company } from '../models/company';
import { CompanyService } from '../services/company.service';

@Component({
	selector: 'app-enlist-modal',
	templateUrl: './enlist-modal.component.html',
	styleUrls: ['./enlist-modal.component.css'],
})
export class EnlistModalComponent implements OnInit {
	@ViewChild('enlistEmployee') enlistEmployee: TemplateRef<any>;

	companies = new Array<Company>();
	users = new Array<User>();

	user: string;
	enlistForm: FormGroup;

	constructor(
		private modalService: NgbModal,
		private companyService: CompanyService,
		private loginService: LoginService,
		private userService: UserService
	) {}

	ngOnInit(): void {
		this.formInit();
	}

	formInit() {
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
		this.getCompanies();
		setTimeout(() => {
			// this.companyFormDirective.resetForm();
			this.modalService.open(this.enlistEmployee, { size: 'lg' });
		});
	}

	getCompanies() {
		let searchCriteriaObj = new SearchCriteriaObj();
		searchCriteriaObj.searchFieldsObj = new SearchFieldObj();
		searchCriteriaObj.searchFieldsObj.id = this.loginService.getUser().id;
		this.companyService.getList(searchCriteriaObj).subscribe(
			response => {
				console.log(response);
				if (response.data.company.list) {
					this.companies = response.data.company.list;
				}
			},
			errorRes => {
				console.error(errorRes);
			}
		);
	}

	getUsers() {
		if (this.user != null && this.user != '') {
			let searchCriteriaObj = new SearchCriteriaObj();
			searchCriteriaObj.searchFieldsObj = new SearchFieldObj();
			searchCriteriaObj.searchFieldsObj.searchFor = this.user;
			this.userService.getList(searchCriteriaObj).subscribe(
				response => {
					if (response.data.user.list) {
						this.users = response.data.user.list;
					}
				},
				errorRes => {
					console.error(errorRes);
				}
			);
		}
	}

	selectedUser(user) {
		console.log(user);
	}
}
