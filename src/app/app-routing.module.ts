import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './components/pages/signup/signup.component';
import { PageNotFoundComponent } from './components/pages/page-not-found/page-not-found.component';
import { UploadImageComponent } from './components/pages/upload-image/upload-image.component';
import { TestComponent } from './components/pages/test/test.component';
import { StoriesComponent } from './components/pages/stories/stories.component';
import { AdminLoginComponent } from './components/admin/admin-login/admin-login.component';
import { AdminContainerComponent } from './components/admin/admin-container/admin-container.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminStoriesComponent } from './components/admin/admin-stories/admin-stories.component';
import { UsersComponent } from './components/admin/users/users.component';
import { UsersStoriesComponent } from './components/admin/users-stories/users-stories.component';
import { RegistrationComponent } from './components/financially-free/registration/registration.component';
import { AllAnswersComponent } from './components/financially-free/all-answers/all-answers.component';
import { AdminAllAnswersComponent } from './components/admin/financiallyfree-admin/admin-all-answers/admin-all-answers.component';
import { WinnersListsComponent } from './components/pages/winners-lists/winners-lists.component';
import { PollsSystemComponent } from './components/financially-free/polls-system/polls-system.component';

const routes: Routes = [
  {path : '', component :SignupComponent},
  {path : 'winners', component :WinnersListsComponent},
  {path : 'polls', component :PollsSystemComponent},
  {path : 'financiallyfree', component :RegistrationComponent},
  // {path : 'all_answers', component :AllAnswersComponent},
  // {path : 'stories', component :StoriesComponent},
  // {path : 'upload', component :UploadImageComponent},
  // {path : 'test', component :TestComponent},
  // {path : 'thankyou', component :ThankyouComponent},


  {path : 'admin',component : AdminLoginComponent},
  {path : 'admin',component : AdminContainerComponent,
  children : [
    {path : 'dashboard',component : AdminDashboardComponent},
    {path : 'users',component : UsersComponent},
    {path : 'stories',component : AdminStoriesComponent},
    {path : 'user_story',component : UsersStoriesComponent},
    // {path : 'answers',component : AdminAllAnswersComponent},
  ]},


  {path : '404', component :PageNotFoundComponent},
  { path: '**', redirectTo: '404', pathMatch: 'full' },

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
