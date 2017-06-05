//Native Imports
import { CanActivate } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class RequesterRouteGuard implements CanActivate {

  constructor() {}

  //Returns true if user is Requester
  canActivate() {
  	var currentUserScope = sessionStorage.getItem('userScope');
  	var reply = false;
  	if(currentUserScope == "Requester"){
  		return true;
  	}else{
  		return false;
  	}
  }
}