//Native Imports
import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class ReviewerRouteGuard implements CanActivate {

  constructor() {}

  //Returns true if user is Reviewer 
  canActivate() {
  	var currentUserScope = sessionStorage.getItem('userScope');
  	var reply = false;
  	if(currentUserScope == "Reviewer"){
  		return true;
  	}else{
  		return false;
  	}
  }
}