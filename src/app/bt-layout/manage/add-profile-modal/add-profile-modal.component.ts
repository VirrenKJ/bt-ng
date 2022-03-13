import { SystemProfile } from './../models/system-profile';
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
})
export class AddProfileModalComponent implements OnInit {
	@ViewChild('addProfile') addProfile: TemplateRef<any>;
	@Output() profileListEvent = new EventEmitter();

	profile = new SystemProfile();
	profileForm: FormGroup;

	constructor(
		private config: NgbModalConfig,
		private _snackBar: MatSnackBar,
		private modalService: NgbModal,
		private customValidationService: CustomValidationService,
		private systemProfileService: SystemProfileService
	) {
		this.config.backdrop = 'static';
		this.config.keyboard = false;
	}

	ngOnInit(): void {
		this.profileForm = new FormGroup({
			id: new FormControl(null),
			platform: new FormControl(null, [Validators.required, this.customValidationService.noWhitespace]),
			osName: new FormControl(null, [Validators.required, this.customValidationService.noWhitespace]),
			osVersion: new FormControl(null, [Validators.required, this.customValidationService.noWhitespace]),
			description: new FormControl(null),
			deleteFlag: new FormControl(null),
			createdAt: new FormControl(null),
			createdBy: new FormControl(null),
			updatedAt: new FormControl(null),
			updatedBy: new FormControl(null),
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
		if (profileId) {
			this.getProfile(profileId);
		}
		setTimeout(() => {
			this.modalService.open(template, { size: 'lg' });
		});
	}

	addUpdateProfile() {
		if (this.profileForm.valid) {
			this.profileForm.get('platform').setValue(this.profileForm.get('platform').value.trim());
			this.profileForm.get('osName').setValue(this.profileForm.get('osName').value.trim());
			this.profileForm.get('osVersion').setValue(this.profileForm.get('osVersion').value.trim());
			if (this.profileForm.get('description').value) {
				this.profileForm.get('description').setValue(this.profileForm.get('description').value.trim());
			}
			if (!this.profileForm.get('id').value) {
				this.addProfileApi();
			} else {
				this.updateProfileApi();
			}
		} else {
			this.snackBarPopup('Invalid Form');
		}
	}

	addProfileApi() {
		this.systemProfileService.add(this.profileForm.value).subscribe(
			response => {
				console.log(response);
				if (response.status === 200 && response.data && response.data.systemProfile) {
					this.confirmationPopup('System Profile Saved.');
				}
			},
			errorRes => {
				console.error(errorRes);
				this.snackBarPopup(errorRes.error.message);
			},
			() => {
				this.profileForm.reset();
			}
		);
	}

	updateProfileApi() {
		this.systemProfileService.update(this.profileForm.value).subscribe(
			response => {
				console.log(response);
				if (response.status === 200 && response.data && response.data.systemProfile) {
					this.confirmationPopup('System Profile Updated.');
				}
			},
			errorRes => {
				console.error(errorRes);
				this.snackBarPopup(errorRes.error.message);
			},
			() => {
				this.profileForm.reset();
			}
		);
	}

	getProfile(profileId) {
		this.systemProfileService.getById(profileId).subscribe(response => {
			console.log(response);
			if (response.status === 200 && response.data && response.data.systemProfile) {
				this.profile = response.data.systemProfile;
				this.profileForm.setValue({
					id: response.data.systemProfile.id,
					platform: response.data.systemProfile.platform,
					osName: response.data.systemProfile.osName,
					osVersion: response.data.systemProfile.osVersion,
					description: response.data.systemProfile.description,
					deleteFlag: response.data.systemProfile.deleteFlag,
					createdAt: response.data.systemProfile.createdAt,
					createdBy: response.data.systemProfile.createdBy,
					updatedAt: response.data.systemProfile.updatedAt,
					updatedBy: response.data.systemProfile.updatedBy,
				});
			}
		});
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
