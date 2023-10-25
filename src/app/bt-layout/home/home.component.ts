import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { LoginService } from 'src/app/authentication/services/login.service';
import { PaginationCriteria } from 'src/app/base/models/pagination_criteria';
import Swal from 'sweetalert2';
import { Issue } from '../issue/models/issue';
import { IssueService } from '../issue/services/issue.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('paginatorIssueAssigned') paginatorIssueAssigned: MatPaginator;
  @ViewChild('paginatorIssueReported') paginatorIssueReported: MatPaginator;
  issueAssignedList = new Array<Issue>();
  issueReportedList = new Array<Issue>();

  paginationCriteriaIssueAssigned = new PaginationCriteria();
  paginationCriteriaIssueReported = new PaginationCriteria();

  dataSourceIssueAssigned = new MatTableDataSource<Issue>(this.issueAssignedList);
  dataSourceIssueReported = new MatTableDataSource<Issue>(this.issueReportedList);

  userId: number;
  displayedColumns: string[] = ['sno', 'project_name', 'category_name', 'assigned', 'reported_by', 'summary', 'action'];

  constructor(private _snackBar: MatSnackBar, private issueService: IssueService, private loginService: LoginService) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.userId = this.loginService.getUser()?.id;
      this.paginationCriteriaIssueAssigned.page = 1;
      this.paginationCriteriaIssueAssigned.limit = 5;
      this.paginationCriteriaIssueReported.page = 1;
      this.paginationCriteriaIssueReported.limit = 5;
      this.getIssueAssignedList();
      this.getIssueReportedList();
    });
  }

  ngAfterViewInit() {
    this.dataSourceIssueAssigned.paginator = this.paginatorIssueAssigned;
    this.dataSourceIssueReported.paginator = this.paginatorIssueReported;
  }

  getIssueAssignedList() {
    this.paginationCriteriaIssueAssigned.assignedId = this.userId;
    this.issueService.getList(this.paginationCriteriaIssueAssigned).subscribe(
      response => {
        console.log(response);
        if (response.status == 200 && response.data && response.data.issue) {
          this.issueAssignedList = response.data.issue.list;
          this.dataSourceIssueAssigned = new MatTableDataSource<Issue>(this.issueAssignedList);
          this.paginatorIssueAssigned.length = response.data.issue.totalRowCount;
        }
      },
      errorRes => {
        console.error(errorRes);
        this.snackBarPopup(errorRes?.error?.message);
      }
    );
  }

  paginationIssueAssigned(event) {
    this.paginationCriteriaIssueAssigned.page = event.pageIndex + 1;
    this.paginationCriteriaIssueAssigned.limit = event.pageSize;
    this.getIssueAssignedList();
  }

  getIssueReportedList() {
    this.paginationCriteriaIssueReported.reportedById = this.userId;
    this.issueService.getList(this.paginationCriteriaIssueReported).subscribe(
      response => {
        console.log(response);
        if (response.status == 200 && response.data && response.data.issue) {
          this.issueReportedList = response.data.issue.list;
          this.dataSourceIssueReported = new MatTableDataSource<Issue>(this.issueReportedList);
          this.paginatorIssueReported.length = response.data.issue.totalRowCount;
        }
      },
      errorRes => {
        console.error(errorRes);
        this.snackBarPopup(errorRes?.error?.message);
      }
    );
  }

  paginationIssueReported(event) {
    this.paginationCriteriaIssueReported.page = event.pageIndex + 1;
    this.paginationCriteriaIssueReported.limit = event.pageSize;
    this.getIssueReportedList();
  }

  deleteIssue(issueId: number, type: string) {
    this.deleteConfirmationPopup().then(result => {
      if (result.value) {
        this.issueService.delete(issueId).subscribe(response => {
          if (response.status == 200) {
            this.deletedConfirmationPopup(response.message, 'Issue', type);
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

  deletedConfirmationPopup(message, title, type) {
    Swal.fire({
      title: title,
      text: message,
      icon: 'success',
      allowOutsideClick: false,
      allowEscapeKey: false,
    }).then(result => {
      if (result.value) {
        switch (type) {
          case 'assigned':
            this.getIssueAssignedList();
            break;
          case 'reported':
            this.getIssueReportedList();
            break;
        }
      }
    });
  }
}
