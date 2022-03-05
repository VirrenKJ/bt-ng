import { Issue } from './../models/issue';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PaginationCriteria } from 'src/app/base/models/pagination_criteria';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { IssueService } from '../services/issue.service';
import { LoginService } from 'src/app/authentication/services/login.service';

@Component({
	selector: 'app-view-issue',
	templateUrl: './view-issue.component.html',
	styleUrls: ['./view-issue.component.css'],
})
export class ViewIssueComponent implements OnInit, AfterViewInit {
	@ViewChild('paginator') paginator: MatPaginator;
	userRole: string = 'Viewer';
	issueList = new Array<Issue>();
	paginationCriteria = new PaginationCriteria();
	dataSource = new MatTableDataSource<Issue>(this.issueList);
	displayedColumns: string[];

	constructor(private _snackBar: MatSnackBar, private issueService: IssueService, private loginService: LoginService) {}

	ngOnInit(): void {
    this.paginationCriteria.page = 1;
		this.paginationCriteria.limit = 5;
		this.getIssueList();
		setTimeout(() => {
      this.userRole = this.loginService.getUserRole();
      this.setDisplayedColumns();
		});
	}

	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
	}

	setDisplayedColumns() {
		switch (this.userRole) {
			case 'Viewer':
				this.displayedColumns = ['sno', 'project_name', 'category_name', 'assigned', 'reported_by', 'summary'];
				break;

			default:
				this.displayedColumns = ['sno', 'project_name', 'category_name', 'assigned', 'reported_by', 'summary', 'action'];
				break;
		}
	}

	getIssueList() {
		this.issueService.getList(this.paginationCriteria).subscribe(
			response => {
				console.log(response);
				if (response.status == 200 && response.data && response.data.issue) {
					this.issueList = response.data.issue.list;
					this.dataSource = new MatTableDataSource<Issue>(this.issueList);
					this.paginator.length = response.data.issue.totalRowCount;
				}
			},
			errorRes => {
				console.error(errorRes);
				this.snackBarPopup(errorRes.error.message);
			}
		);
	}

	paginationIssue(event) {
		this.paginationCriteria.page = event.pageIndex + 1;
		this.paginationCriteria.limit = event.pageSize;
		this.getIssueList();
	}

	deleteIssue(issueId) {
		this.deleteConfirmationPopup().then(result => {
			if (result.value) {
				this.issueService.delete(issueId).subscribe(response => {
					if (response.status == 200) {
						this.deletedConfirmationPopup(response.message, 'Issue');
					}
				});
			}
		});
	}

	snackBarPopup(message: string) {
		this._snackBar.open(message, 'OK', {
			duration: 3000,
			horizontalPosition: 'center',
			verticalPosition: 'top',
		});
	}

	deleteConfirmationPopup() {
		return Swal.fire({
			title: 'Warning',
			text: 'Are you sure that you want to perform this action?',
			icon: 'question',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Yes',
			cancelButtonText: 'No',
			allowOutsideClick: false,
			allowEscapeKey: false,
		});
	}

	deletedConfirmationPopup(message, title) {
		Swal.fire({
			title: title,
			text: message,
			icon: 'success',
			allowOutsideClick: false,
			allowEscapeKey: false,
		}).then(result => {
			if (result.value) {
				this.getIssueList();
			}
		});
	}
}
