import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'app-add-profile-modal',
	templateUrl: './add-profile-modal.component.html',
	styleUrls: ['./add-profile-modal.component.css'],
	providers: [NgbModalConfig, NgbModal],
})
export class AddProfileModalComponent implements OnInit {
	@ViewChild('addProfile') addProfile: TemplateRef<any>;

	profileForm: FormGroup;

	constructor(config: NgbModalConfig, private modalService: NgbModal) {
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
		this.profileForm = new FormGroup({
			id: new FormControl(),
			platform: new FormControl(null, Validators.required),
			osName: new FormControl(null, Validators.required),
			osVersion: new FormControl(null, Validators.required),
			description: new FormControl(null, Validators.required),
			deleteFlag: new FormControl(),
		});
	}

	@Input()
	set openProfileModal(data: any) {
		if (data && !data.profileId) {
			this.openModal(this.addProfile);
		}
		if (data && data.profileId) {
			this.openModal(this.addProfile, data.profileId);
		}
	}

	openModal(template: TemplateRef<any>, profileId = null) {
		setTimeout(() => {
			this.modalService.open(template, { size: 'lg' });
		});
	}

	onSubmit() {
		console.log('Submitted!');
	}
}
