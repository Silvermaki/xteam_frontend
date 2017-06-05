//Native Imports
import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {RouterModule} from "@angular/router";
import {FormsModule,ReactiveFormsModule} from "@angular/forms";

//Third Party Imports
import {LaddaModule} from 'angular2-ladda';
import {ModalModule} from 'ngx-bootstrap';

//Component Imports
import {XteamRequestComponent} from "./xteam_request.component";
import {XteamRequestService} from "../xteam_request/xteam_request.service";

@NgModule({
  declarations: [
    XteamRequestComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    LaddaModule,
    ModalModule
  ],
  exports: [
    XteamRequestComponent
  ],
  providers:[XteamRequestService]
})

export class XteamRequestModule {
}