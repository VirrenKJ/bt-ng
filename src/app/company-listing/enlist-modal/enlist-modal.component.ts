import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from 'src/app/authentication/common/models/user';
import { LoginService } from 'src/app/authentication/services/login.service';
import { UserService } from 'src/app/authentication/services/user.service';
import { SearchCriteriaObj } from 'src/app/base/models/search_criteria_obj';
import { SearchFieldObj } from 'src/app/base/models/search_field_obj';
import Swal from 'sweetalert2';
import { Company } from '../models/company';
import { CompanyService } from '../services/company.service';

@Component({
	selector: 'app-enlist-modal',
	templateUrl: './enlist-modal.component.html',
	styleUrls: ['./enlist-modal.component.css'],
})
export class EnlistModalComponent implements OnInit {
	@ViewChild('enlistEmployee') enlistEmployee: TemplateRef<any>;
	@Output() reloadCompanies = new EventEmitter();

	companies = new Array<Company>();
	users = new Array<User>();
	company = new Company();
	user = new User();

	searchFor: string;

	constructor(
		private modalService: NgbModal,
		private companyService: CompanyService,
		private loginService: LoginService,
		private userService: UserService,
		private _snackBar: MatSnackBar
	) {}

	ngOnInit(): void {}

	@Input()
	set openEnlistingModal(data: any) {
		if (data) {
			this.openModal();
		}
	}

	openModal() {
		this.onInit();
		setTimeout(() => {
			this.modalService.open(this.enlistEmployee, { size: 'lg' });
		});
	}

	onInit() {
		this.getCompanies();
		this.users = new Array<User>();
		this.company = new Company();
		this.user = new User();
		this.searchFor = '';
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
				this.snackBarPopup(errorRes.error.message);
			}
		);
	}

	getUsers() {
		let searchCriteriaObj = new SearchCriteriaObj();
		searchCriteriaObj.limit = 10;
		searchCriteriaObj.page = 1;
		searchCriteriaObj.searchFieldsObj = new SearchFieldObj();
		searchCriteriaObj.searchFieldsObj.searchFor = this.searchFor;
		this.userService.getList(searchCriteriaObj).subscribe(
			response => {
				if (response.data.user.list) {
					this.users = response.data.user.list;
				}
			},
			errorRes => {
				console.error(errorRes);
				this.snackBarPopup(errorRes.error.message);
			}
		);
	}

	selectedUser(user: User) {
		console.log(user);
		this.user.id = user.id;
	}

	onSubmit() {
		this.company.users = new Array<User>();
		this.company.users.push(this.user);
		console.log(this.company);
		this.companyService.update(this.company).subscribe(
			response => {
				console.log(response);
				this.confirmationPopup();
			},
			errorRes => {
				console.error(errorRes);
				this.snackBarPopup(errorRes.error.message);
			}
		);
	}

	snackBarPopup(message: string) {
		this._snackBar.open(message, 'OK', {
			duration: 3000,
			horizontalPosition: 'center',
			verticalPosition: 'top',
		});
	}

	confirmationPopup() {
		Swal.fire({
			icon: 'success',
			title: 'Enlisted Successfully',
			showConfirmButton: false,
			timer: 2000,
		}).then(() => {
			this.reloadCompanies.emit();
			this.modalService.dismissAll();
		});
	}
}
