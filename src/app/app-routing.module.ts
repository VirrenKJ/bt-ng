import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { HomeComponent } from './home/home.component';
import { AddIssueComponent } from './issue/add-issue/add-issue.component';
import { ViewIssueComponent } from './issue/view-issue/view-issue.component';
import { ManageComponent } from './manage/manage.component';
import { SummaryComponent } from './summary/summary.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'view-issue', component: ViewIssueComponent },
  { path: 'add-issue', component: AddIssueComponent },
  { path: 'manage', component: ManageComponent },
  { path: 'summary', component: SummaryComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
