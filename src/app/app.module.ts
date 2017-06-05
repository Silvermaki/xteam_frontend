//Native Imports
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule,ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule} from "@angular/router";
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {ROUTES} from "./app.routes";

//Components and Modules Imports
import {AppComponent} from './app.component';
import {LoginModule} from "./views/login/login.module";
import {RegisterModule} from "./views/register/register.module";
import {NewRequestModule} from "./views/new_request/new_request.module";
import {HomeModule} from "./views/home/home.module";
import {XteamRequestModule} from "./views/xteam_request/xteam_request.module";
import {MyRequestsModule} from "./views/my_requests/my_requests.module";
import {ReviewRequestModule} from "./views/review_request/review_request.module";
import {LayoutsModule} from "./components/common/layouts/layouts.module";

//Guards Imports
import {RequesterRouteGuard} from './requester.routeguard';
import {ReviewerRouteGuard} from './reviewer.routeguard';
import {LoginRouteGuard} from './login.routeguard';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    LayoutsModule,
    LoginModule,
    RegisterModule,
    NewRequestModule,
    HomeModule,
    XteamRequestModule,
    MyRequestsModule,
    ReviewRequestModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}, ReviewerRouteGuard, RequesterRouteGuard, LoginRouteGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
