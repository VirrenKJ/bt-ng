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
import { MatTabsModule } from '@angular/material/tabs';
import { ViewIssueComponent } from './issue/view-issue/view-issue.component';
import { AddIssueComponent } from './issue/add-issue/add-issue.component';
import { SummaryComponent } from './summary/summary.component';
import { ManageComponent } from './manage/manage.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddUserModalComponent } from './manage/add-user-modal/add-user-modal.component';
import { AddProjectModalComponent } from './manage/add-project-modal/add-project-modal.component';
import { AddCategoryModalComponent } from './manage/add-category-modal/add-category-modal.component';
import { AddProfileModalComponent } from './manage/add-profile-modal/add-profile-modal.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { SignupComponent } from './authentication/signup/signup.component';
import { LoginComponent } from './authentication/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    MainNavComponent,
    HomeComponent,
    ViewIssueComponent,
    AddIssueComponent,
    SummaryComponent,
    ManageComponent,
    AddUserModalComponent,
    AddProjectModalComponent,
    AddCategoryModalComponent,
    AddProfileModalComponent,
    SignupComponent,
    LoginComponent,
  ],

  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule,
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
    MatTabsModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    NgbModule,
    HttpClientModule,
  ],
  exports: [MatButtonModule, MatToolbarModule, MatSidenavModule, MatIconModule, MatListModule, MatMenuModule, MatSelectModule, MatFormFieldModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
