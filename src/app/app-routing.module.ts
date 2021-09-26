import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginLayoutComponent } from './authentication/login-layout/login-layout.component';
import { LoginComponent } from './authentication/login/login.component';
import { SignupComponent } from './authentication/signup/signup.component';
import { AdminGuard } from './base/services/admin.guard';
import { HomeLayoutComponent } from './home-layout/home-layout.component';
import { HomeComponent } from './home/home.component';
import { AddIssueComponent } from './issue/add-issue/add-issue.component';
import { ViewIssueComponent } from './issue/view-issue/view-issue.component';
import { ManageComponent } from './manage/manage.component';
import { SummaryComponent } from './summary/summary.component';

const routes: Routes = [
  { path: '', redirectTo: 'user', pathMatch: 'full' },
  {
    path: 'user',
    component: LoginLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'signup',
        pathMatch: 'full',
      },
      {
        path: 'signup',
        component: SignupComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'main',
    component: HomeLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      { path: 'home', component: HomeComponent },
      { path: 'view-issue', component: ViewIssueComponent },
      { path: 'add-issue', component: AddIssueComponent },
      { path: 'summary', component: SummaryComponent },
      { path: 'manage', component: ManageComponent, pathMatch: 'full', canActivate: [AdminGuard] },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
