//Native imports
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router'; 

//Third party libraries imports
import { default as swal } from 'sweetalert2';

//Providers imports
import { LoginService } from './login.service';

@Component({
  selector: 'login',
  templateUrl: 'login.template.html'
})


export class LoginComponent implements OnInit{
  //Component varibles

  //login_form FormGroup to be used as a Model Driven Form
  private login_form:FormGroup;
  //submitLogin keeps track on weather the form has been submitted or not (in order to display errors, if any)
  private submitLogin:Boolean;
  //loader is a boolean that whenever it's set to TRUE, the spinner animation on the Sign in button will be activated
  private loader:Boolean;

  //LoginComponent Constructor, FormBuilder reference, LoginService reference, and Router reference
  constructor(form_builder: FormBuilder, private service : LoginService, private router:Router){
    //submitLogin is false when the component loads
    this.submitLogin = false;
    this.loader = false;
    //We set the validators and initial values of the fields contained within the login_form
    this.login_form = form_builder.group({
      'username_email' : [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
      'password': [null, Validators.compose([Validators.required, Validators.maxLength(25)])]
    })
  }

  ngOnInit(){
    sessionStorage.clear();
    sessionStorage.setItem("session", "false");
    sessionStorage.setItem("scope", "none");
  }

  //login(): Sends the information submitted into the login_form to the respective backend's endpoint using the LoginService reference.
  login(){
    //Verifies if login_form is valid
    if(this.login_form.valid){
      //Activate loader spinner animation
      this.loader = true;
      //Prepare the load to send to the endpoint as an object
      var load = {	
        email:this.login_form.controls['username_email'].value.toLowerCase(), 
        password:this.login_form.controls['password'].value
      };
      //Declare a variable to store the endpoint's response
      var response;
      //Send load to login service function
      this.service.login(load).subscribe(
        //Store response
        data => response = data[0],
        //Alert server error if server is not responding
        err => {this.loader = false;this.internalServerError();},
        ()=> {
          //After storing the response
          if(response.user_id > -1){
            //Login User
            //For testing purposes we are storing the session on sessionStorage without a session hash
            sessionStorage.setItem("userId", response.user_id);
            sessionStorage.setItem("userName", response.user_name);
            sessionStorage.setItem("userEmail", response.user_email);
            sessionStorage.setItem("userScope", response.user_scope);
            sessionStorage.setItem("session", "true");
            //Go to App
            this.router.navigateByUrl('/dashboard/home');
          }else if(response.user_id == -1){
            //Clear Session
            sessionStorage.clear();
            sessionStorage.setItem("session", "false");
            sessionStorage.setItem("scope", "none");
            //Alert Login error
            this.loginError();
          }else{
            //Clear Session
            sessionStorage.clear();
            sessionStorage.setItem("session", "false");
            sessionStorage.setItem("scope", "none");
            //Alert Server error
            this.internalServerError();
          }
          //Disable loader spinner animation
          this.loader = false;
        }
        );

    }else{
      //Sets submitLogin as TRUE if login_form is not valid
      this.submitLogin = true;
    }

  }


  //loginError(): Alerts the user if their password or username is incorrect
  loginError() {
    swal({
      title: "Incorrect Username/Email or Password",
      text: "The provided combination of username/email and password does not exist, please try again.",
      type: "error",
      allowOutsideClick: false
    }).catch(swal.noop)
  }

  //internalServerError(): Alerts the user if there is any error when trying to communicate with the backend server
  internalServerError() {
    swal({
      title: "Internal Server Error",
      text: "Internal Server Error. Be sure you started the backend server before running the frontend. If it still doesn't work, contact Makoto.",
      type: "warning",
      allowOutsideClick: false
    }).catch(swal.noop)
  }
}
