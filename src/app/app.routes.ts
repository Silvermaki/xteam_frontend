//Native Imports
import {Routes} from "@angular/router";

//Component Imports
import {LoginComponent} from "./views/login/login.component";
import {RegisterComponent} from "./views/register/register.component";
import {NewRequestComponent} from "./views/new_request/new_request.component";
import {HomeComponent} from "./views/home/home.component";
import {XteamRequestComponent} from "./views/xteam_request/xteam_request.component";
import {BasicLayoutComponent} from "./components/common/layouts/basicLayout.component";
import {ReviewRequestComponent} from "./views/review_request/review_request.component";
import {MyRequestsComponent} from "./views/my_requests/my_requests.component";

//Guards Imports
import {RequesterRouteGuard} from './requester.routeguard';
import {ReviewerRouteGuard} from './reviewer.routeguard';
import {LoginRouteGuard} from './login.routeguard';

export const ROUTES:Routes = [
  	{path: 'login', component: LoginComponent},
  	{path: 'register', component: RegisterComponent},
  	{path: 'dashboard', component: BasicLayoutComponent, canActivate: [LoginRouteGuard], 
    children: [
      	{path: 'new_request', component: NewRequestComponent, canActivate: [RequesterRouteGuard]},
      	{path: 'xteam_request', component: XteamRequestComponent, canActivate: [RequesterRouteGuard]},
        {path: 'my_requests', component: MyRequestsComponent, canActivate: [RequesterRouteGuard]},
        {path: 'review', component: ReviewRequestComponent, canActivate: [ReviewerRouteGuard]},
      	{path: 'home', component: HomeComponent}
    ]
  },
  {path: '**',  redirectTo: 'login'}
];
