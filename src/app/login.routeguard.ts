//Native Imports
import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class LoginRouteGuard implements CanActivate {

  constructor() {}

  //Returns true if user is Requester
  canActivate() {
  	var currentUserScope = sessionStorage.getItem('userScope');
  	var reply = false;
  	if(currentUserScope == "Requester" || currentUserScope == "Reviewer"){
  		return true;
  	}else{
  		return false;
  	}
  }
}