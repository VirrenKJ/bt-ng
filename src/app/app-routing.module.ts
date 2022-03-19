import { ForgotPasswordComponent } from './authentication/forgot-password/forgot-password.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginLayoutComponent } from './authentication/login-layout/login-layout.component';
import { LoginComponent } from './authentication/login/login.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { AdminGuard } from './base/services/admin.guard';
import { AuthGuard } from './base/services/auth.guard';
import { BugTrackerExitGuard } from './base/services/bug-tracker-exit.guard';
import { BugTrackerGuard } from './base/services/bug-tracker.guard';
import { LoggedInGuard } from './base/services/logged-in.guard';
import { ViewerGuard } from './base/services/viewer.guard';
import { CompanyListingComponent } from './company-listing/company-listing.component';
import { BtLayoutComponent } from './bt-layout/bt-layout.component';
import { HomeComponent } from './bt-layout/home/home.component';
import { AddIssueComponent } from './bt-layout/issue/add-issue/add-issue.component';
import { ViewIssueComponent } from './bt-layout/issue/view-issue/view-issue.component';
import { ManageComponent } from './bt-layout/manage/manage.component';
import { SummaryComponent } from './bt-layout/summary/summary.component';

const routes: Routes = [
	{ path: '', redirectTo: 'user', pathMatch: 'full' },
	{
		path: 'user',
		component: LoginLayoutComponent,
		children: [
			{
				path: '',
				redirectTo: 'login',
				pathMatch: 'full',
			},
      {
        path: 'login',
        component: LoginComponent,
        pathMatch: 'full',
      },
			{
				path: 'signup',
				component: SignupComponent,
			},
      {
				path: 'forgot-password',
				component: ForgotPasswordComponent,
			},
		],
		canActivate: [LoggedInGuard, BugTrackerExitGuard],
	},
	{
		path: 'companies',
		component: CompanyListingComponent,
		canActivate: [AuthGuard, BugTrackerExitGuard],
	},
	{
		path: 'bug-tracker',
		component: BtLayoutComponent,
		children: [
			{
				path: '',
				redirectTo: 'home',
				pathMatch: 'full',
			},
			{ path: 'home', component: HomeComponent, canActivate: [ViewerGuard] },
			{ path: 'view-issue', component: ViewIssueComponent },
			{ path: 'add-issue', component: AddIssueComponent, canActivate: [ViewerGuard] },
			{ path: 'edit-issue/:id', component: AddIssueComponent, canActivate: [ViewerGuard] },
			{ path: 'summary', component: SummaryComponent },
			{ path: 'manage', component: ManageComponent, pathMatch: 'full', canActivate: [AdminGuard] },
		],
		canActivate: [AuthGuard, BugTrackerGuard],
	},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
