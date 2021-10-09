import { Component, OnInit } from '@angular/core';
import { faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'app-company-listing',
	templateUrl: './company-listing.component.html',
	styleUrls: ['./company-listing.component.css'],
})
export class CompanyListingComponent implements OnInit {
	faUser = faUser;
	constructor() {}

	ngOnInit(): void {}
}
