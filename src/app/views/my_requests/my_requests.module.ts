//Native Imports
import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {RouterModule} from "@angular/router";
import {FormsModule,ReactiveFormsModule} from "@angular/forms";

//Third Party Imports
import {LaddaModule} from 'angular2-ladda';
import {ModalModule} from 'ngx-bootstrap';

//Component Imports
import {MyRequestsComponent} from "./my_requests.component";
import {MyRequestsService} from "./my_requests.service";

@NgModule({
  declarations: [
    MyRequestsComponent
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
    MyRequestsComponent
  ],
  providers:[MyRequestsService]
})

export class MyRequestsModule {
}