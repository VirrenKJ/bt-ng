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
import { MatInputModule } from '@angular/material/input';
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
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToolbarComponent } from './home-layout/toolbar/toolbar.component';
import { authInterceptorProvider } from './base/services/auth.interceptor';
import { LoginLayoutComponent } from './authentication/login-layout/login-layout.component';
import { HomeLayoutComponent } from './home-layout/home-layout.component';
import { NgxUiLoaderConfig, NgxUiLoaderHttpModule, NgxUiLoaderModule, SPINNER, POSITION, NgxUiLoaderRouterModule } from 'ngx-ui-loader';
import { CompanyListingComponent } from './company-listing/company-listing.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NewCompanyComponent } from './company-listing/new-company/new-company.component';
import { TenantInterceptor, tenantInterceptorProvider } from './base/services/tenant.interceptor';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
	bgsColor: '#c33c5b',
	bgsOpacity: 1,
	bgsPosition: POSITION.bottomRight,
	bgsSize: 80,
	bgsType: SPINNER.threeStrings,
	blur: 4,
	delay: 0,
	fastFadeOut: true,
	fgsColor: '#c33c5b',
	fgsPosition: POSITION.centerCenter,
	fgsSize: 80,
	fgsType: SPINNER.threeStrings,
	gap: 24,
	logoPosition: POSITION.centerCenter,
	logoSize: 110,
	logoUrl: 'assets/bug.png',
	masterLoaderId: 'master',
	overlayBorderRadius: '0',
	overlayColor: 'rgba(40,40,40,0.61)',
	pbColor: '#ffffff',
	pbDirection: 'ltr',
	pbThickness: 3,
	hasProgressBar: true,
	text: '',
	textColor: '#3e3e3e',
	textPosition: POSITION.centerCenter,
	maxTime: -1,
	minTime: 300,
};

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
		ToolbarComponent,
		LoginLayoutComponent,
		HomeLayoutComponent,
		CompanyListingComponent,
		NewCompanyComponent,
	],

	imports: [
		AppRoutingModule,
		BrowserModule,
		BrowserAnimationsModule,
		LayoutModule,
		FormsModule,
		ReactiveFormsModule,
		FontAwesomeModule,
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
		MatSnackBarModule,
		MatTooltipModule,
		BsDropdownModule.forRoot(),
		ModalModule.forRoot(),
		NgbModule,
		HttpClientModule,
		MatInputModule,
		NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
		NgxUiLoaderHttpModule,
		NgxUiLoaderRouterModule.forRoot({
			showForeground: false,
		}),
	],
	exports: [MatButtonModule, MatToolbarModule, MatSidenavModule, MatIconModule, MatListModule, MatMenuModule, MatSelectModule, MatFormFieldModule],
	providers: [authInterceptorProvider, tenantInterceptorProvider],
	bootstrap: [AppComponent],
})
export class AppModule {}
