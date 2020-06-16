import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from "@angular/http";
import { AppRoutingModule } from './app-routing.module';
import {WebcamModule} from 'ngx-webcam';
import { SocialLoginModule, AuthServiceConfig } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";

//pagination
import { NgxPaginationModule } from "ngx-pagination";
import { ChartsModule } from 'ng2-charts';

import { AppComponent } from './app.component';
import { SignupComponent } from './components/pages/signup/signup.component';
import { ApisService } from './services/apis.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageNotFoundComponent } from './components/pages/page-not-found/page-not-found.component';
import { UploadImageComponent } from './components/pages/upload-image/upload-image.component';
import { TestComponent } from './components/pages/test/test.component';
import { StoriesComponent } from './components/pages/stories/stories.component';
import { AdminLoginComponent } from './components/admin/admin-login/admin-login.component';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard.component';
import { AdminContainerComponent } from './components/admin/admin-container/admin-container.component';
import { AdminSidebarComponent } from './components/admin/admin-sidebar/admin-sidebar.component';
import { AdminStoriesComponent } from './components/admin/admin-stories/admin-stories.component';
import { UsersComponent } from './components/admin/users/users.component';
import { UsersStoriesComponent } from './components/admin/users-stories/users-stories.component';
import { RegistrationComponent } from './components/financially-free/registration/registration.component';
import { AllAnswersComponent } from './components/financially-free/all-answers/all-answers.component';
import { AdminAllAnswersComponent } from './components/admin/financiallyfree-admin/admin-all-answers/admin-all-answers.component';
import { WinnersListsComponent } from './components/pages/winners-lists/winners-lists.component';
import { PollsSystemComponent } from './components/financially-free/polls-system/polls-system.component';
let config = new AuthServiceConfig([
  // {
  //   id: GoogleLoginProvider.PROVIDER_ID,
  //   provider: new GoogleLoginProvider("544212447141-b81qg8qtiliejrodkjip6trvu27tlptq.apps.googleusercontent.com")
  // },
  // {
  //   id: FacebookLoginProvider.PROVIDER_ID,
  //   provider: new FacebookLoginProvider("458108588077309")
  // }
]);

export function provideConfig() {
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    PageNotFoundComponent,
    UploadImageComponent,
    TestComponent,
    StoriesComponent,
    AdminLoginComponent,
    AdminDashboardComponent,
    AdminContainerComponent,
    AdminSidebarComponent,
    AdminStoriesComponent,
    UsersComponent,
    UsersStoriesComponent,
    RegistrationComponent,
    AllAnswersComponent,
    AdminAllAnswersComponent,
    WinnersListsComponent,
    PollsSystemComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    WebcamModule,
    ChartsModule,
    NgxPaginationModule,
    SocialLoginModule
  ],
  providers: [ApisService, {
    provide: AuthServiceConfig,
    useFactory: provideConfig
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
