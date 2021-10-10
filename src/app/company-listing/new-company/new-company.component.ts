import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-new-company',
	templateUrl: './new-company.component.html',
	styleUrls: ['./new-company.component.css'],
})
export class NewCompanyComponent implements OnInit {
	@ViewChild('addCompany') addCompany: TemplateRef<any>;

	constructor(config: NgbModalConfig, private modalService: NgbModal) {
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {}

	@Input()
	set openCompanyModal(data: any) {
		if (data && !data.companyId) {
			this.openModal(this.addCompany);
		}
		if (data && data.companyId) {
			this.openModal(this.addCompany, data.companyId);
		}
	}

	openModal(template: TemplateRef<any>, companyId = null) {
		setTimeout(() => {
			this.modalService.open(template, { size: 'lg' });
		});
	}

	companyForm = new FormGroup({
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
