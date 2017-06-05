//Native imports
import { Component } from '@angular/core';
import {Router} from '@angular/router';

//Third party libraries imports
import 'jquery-slimscroll';
declare var jQuery:any;

@Component({
  selector: 'navigation',
  templateUrl: 'navigation.template.html'
})

export class NavigationComponent {
  //Component Variables
  private userName:String;//store logged in Username
  private userEmail:String;//store logged in Email
  private userScope:String;//store logged in Scope
  private userId:String;//store logged in UserId
  
  constructor(private router: Router) {
    this.userName = sessionStorage.getItem("userName");//store logged in Username
    this.userEmail = sessionStorage.getItem("userEmail");//store logged in Email
    this.userScope = sessionStorage.getItem("userScope");//store logged in Scope
    this.userId = sessionStorage.getItem("userId");//store logged in UserId
  }

  ngAfterViewInit() {
    //get side-menu id reference
    jQuery('#side-menu').metisMenu();
    if (jQuery("body").hasClass('fixed-sidebar')) {
      //collapse sidebar if body has fixed-sidebar class
      jQuery('.sidebar-collapse').slimscroll({
        height: '100%'
      })
    }
  }

  //activeRoyute(string): get true if route is active
  activeRoute(routename: string): boolean{
    return this.router.url.indexOf(routename) > -1;
  }


}
