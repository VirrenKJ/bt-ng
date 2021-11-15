import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/authentication/common/models/user';
import { CustomValidationService } from 'src/app/authentication/services/custom-validation.service';
import { LoginService } from 'src/app/authentication/services/login.service';
import { UserService } from 'src/app/authentication/services/user.service';
import Swal from 'sweetalert2';
import { Company } from '../models/company';
import { CompanyService } from '../services/company.service';

@Component({
	selector: 'app-new-company',
	templateUrl: './new-company.component.html',
	styleUrls: ['./new-company.component.css'],
})
export class NewCompanyComponent implements OnInit {
	@ViewChild(FormGroupDirective) companyFormDirective: FormGroupDirective;
	@ViewChild('addCompany') addCompany: TemplateRef<any>;
	@Output() reloadBusinesses = new EventEmitter();

	companyForm = new FormGroup({
		userId: new FormControl(),
		name: new FormControl(null, [Validators.required, this.customValidationService.noWhitespace]),
		email: new FormControl(null, [Validators.required, Validators.email]),
		contactNumber: new FormControl(null, Validators.required),
		industryType: new FormControl(null, Validators.required),
		pinCode: new FormControl(null, Validators.required),
		state: new FormControl(null, Validators.required),
		city: new FormControl(null, [Validators.required, this.customValidationService.noWhitespace]),
	});

	constructor(
		private companyService: CompanyService,
		private userService: UserService,
		private loginService: LoginService,
		private config: NgbModalConfig,
		private modalService: NgbModal,
		private customValidationService: CustomValidationService,
		private _snackBar: MatSnackBar
	) {
		this.config.backdrop = 'static';
		this.config.keyboard = false;
	}

	ngOnInit(): void {
		this.removeWhitespace();
	}

	@Input()
	set openCompanyModal(data: any) {
		if (data && !data.companyId) {
			this.openModal();
		}
		if (data && data.companyId) {
			this.openModal(data.companyId);
		}
	}

	openModal(companyId = null) {
		setTimeout(() => {
			// this.companyFormDirective.resetForm();
			this.modalService.open(this.addCompany, { size: 'lg' });
		});
	}

	onSubmit() {
		if (this.companyForm.valid) {
			this.companyService.add(this.companyForm.value).subscribe(
				responseCompany => {
					if (responseCompany.data && responseCompany.data.company) {
						let company: Company = responseCompany.data.company;
						console.log('New Company: ' + company);
						// this.companyService.setTenant(company.dbUuid);
						this.companyService.copyCompanyToTenant(company, company.dbUuid).subscribe(responseCopy => {
							if (responseCopy.data && responseCopy.data.company) {
								console.log('Copied Company: ' + responseCopy.data.company);
								this.companyService.exitBugTracker();
							}
						});
					}
				},
				errorRes => {
					console.error(errorRes);
					this.snackBarPopup(errorRes.error.message);
				},
				() => {
					this.confirmationPopup();
				}
			);
		} else {
			this.snackBarPopup('Invalid Form');
		}
	}

	removeWhitespace() {
		this.companyForm
			.get('name')
			.valueChanges.pipe(
				map(value => {
					if (value != value.trimStart()) {
						return this.companyForm.get('name').setValue(value.trimStart());
					}
				})
			)
			.subscribe();
		this.companyForm.get('city').valueChanges.subscribe(value => {
			if (value != value.trimStart()) {
				this.companyForm.get('city').setValue(value.trimStart());
			}
		});
		// this.companyForm.get('email').valueChanges.subscribe(value => {
		// 	if (value != value.trimStart()) {
		// 		this.companyForm.get('email').setValue(value.trimStart());
		// 	}
		// });
	}

	confirmationPopup() {
		Swal.fire({
			icon: 'success',
			title: 'Company Registered',
			showConfirmButton: false,
			timer: 2000,
		}).then(() => {
			this.reloadBusinesses.emit();
			this.modalService.dismissAll();
		});
	}

	snackBarPopup(message: string) {
		this._snackBar.open(message, 'OK', {
			duration: 3000,
			horizontalPosition: 'center',
			verticalPosition: 'top',
		});
	}

	industryType = [
		'Accounting and Bookkeeping',
		'Advertising or public relations',
		'Agriculture, ranching or farming',
		'Art, writing and Photography',
		'Automotive sale or repair',
		'Chartered Accountant (CA)',
		'Church and religious Organization',
		'Construction General Contractor',
		'Construction Trades (plumbers Electrician, HVAC etc)',
		'Design Architecture or engineering',
		'Financial Services other than Accounting and Book Keeping',
		'General Product Based - Business',
		'General Service Based Business',
		'Hair Salon, Beauty Salon, or Barber Shop',
		'Information Technologies (Computers, Software)',
		'Insurance Agency or Broker',
		'Lawn Care or Landscaping',
		'Legal Services',
		'Lodging (Hotel, Motel)',
		'Manufacturer Representative or Agent',
		'Manufacturing',
		'Medical, Dental, or Health Services',
		'Non Profit',
		'Other Services',
		'Professional Consulting',
		'Property Management or Home Association',
		'Real Estate Brokerage or Developer',
		'Rental',
		'Repair and maintenance',
		'Restaurant, Caterer or Bar',
		'Retail Shop or Online Commerce',
		'Sales : Independent Agent',
		'Security Services',
		'Transportation, trucking or delivery',
		'Wholesale Distribution and Sale',
	];

	states = [
		'Andaman and Nicobar Islands',
		'Andhra Pradesh',
		'Arunachal Pradesh',
		'Assam',
		'Bihar',
		'Chandigarh',
		'Chhattisgarh',
		'Dadra and Nagar Haveli and Daman and Diu',
		'Daman and Diu',
		'Delhi',
		'Goa',
		'Gujarat',
		'Haryana',
		'Himachal Pradesh',
		'Jammu and Kashmir',
		'Jharkhand',
		'Karnataka',
		'Kerala',
		'Lakshadweep',
		'Madhya Pradesh',
		'Maharashtra',
		'Manipur',
		'Meghalaya',
		'Mizoram',
		'Nagaland',
		'Odisha',
		'Pondicherry',
		'Punjab',
		'Rajasthan',
		'Sikkim',
		'Tamil Nadu',
		'Telangana',
		'Tripura',
		'Uttar Pradesh',
		'Uttarakhand',
		'West Bengal',
		'Ladakh',
	];
}
