import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomValidationService } from 'src/app/authentication/services/custom-validation.service';
import Swal from 'sweetalert2';
import { SystemProfileService } from '../services/system-profile.service';

@Component({
	selector: 'app-add-profile-modal',
	templateUrl: './add-profile-modal.component.html',
	styleUrls: ['./add-profile-modal.component.css'],
	providers: [NgbModalConfig, NgbModal],
})
export class AddProfileModalComponent implements OnInit {
	@ViewChild('addProfile') addProfile: TemplateRef<any>;
	@Output() profileListEvent = new EventEmitter();

	profileForm: FormGroup;

	constructor(
		config: NgbModalConfig,
		private _snackBar: MatSnackBar,
		private modalService: NgbModal,
		private customValidationService: CustomValidationService,
		private systemProfileService: SystemProfileService
	) {
		config.backdrop = 'static';
		config.keyboard = false;
	}

	ngOnInit(): void {
		this.profileForm = new FormGroup({
			id: new FormControl(null),
			platform: new FormControl(null, [Validators.required, this.customValidationService.noWhitespace]),
			osName: new FormControl(null, [Validators.required, this.customValidationService.noWhitespace]),
			osVersion: new FormControl(null, [Validators.required, this.customValidationService.noWhitespace]),
			description: new FormControl(null),
			deleteFlag: new FormControl(null),
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
		if (this.profileForm.valid) {
			this.profileForm.get('platform').setValue(this.profileForm.get('platform').value.trim());
			this.profileForm.get('osName').setValue(this.profileForm.get('osName').value.trim());
			this.profileForm.get('osVersion').setValue(this.profileForm.get('osVersion').value.trim());
			if (this.profileForm.get('description').value) {
				this.profileForm.get('description').setValue(this.profileForm.get('description').value.trim());
			}
			this.systemProfileService.add(this.profileForm.value).subscribe(
				response => {
					console.log(response);
					this.confirmationPopup('System Profile Saved.');
				},
				errorRes => {
					console.error(errorRes);
					this.snackBarPopup(errorRes.error.message);
				}
			);
		} else {
			this.snackBarPopup('Invalid Form');
		}
	}

	confirmationPopup(title: string) {
		Swal.fire({
			icon: 'success',
			title: title,
			showConfirmButton: false,
			timer: 2000,
		}).then(() => {
			this.profileListEvent.emit();
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
}
