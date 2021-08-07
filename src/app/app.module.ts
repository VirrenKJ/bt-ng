import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MainNavComponent } from './main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ViewIssueComponent } from './issue/view-issue/view-issue.component';
import { AddIssueComponent } from './issue/add-issue/add-issue.component';
import { SummaryComponent } from './summary/summary.component';
import { ManageComponent } from './manage/manage.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'view-issue', component: ViewIssueComponent },
  { path: 'add-issue', component: AddIssueComponent },
  { path: 'manage', component: ManageComponent },
  { path: 'summary', component: SummaryComponent },
];

@NgModule({
  declarations: [AppComponent, MainNavComponent, HomeComponent, ViewIssueComponent, AddIssueComponent, SummaryComponent, ManageComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    BsDropdownModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    NgbModule,
  ],
  exports: [MatButtonModule, MatToolbarModule, MatSidenavModule, MatIconModule, MatListModule, MatMenuModule, MatSelectModule, MatFormFieldModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
