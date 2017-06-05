//Native imports
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms'; 
import { Router } from '@angular/router';

//Third party libraries imports
import { default as swal } from 'sweetalert2';
import {ModalDirective} from 'ngx-bootstrap';

//Providers imports
import { RegisterService } from './register.service';


@Component({
  selector: 'register',
  templateUrl: 'register.template.html'
})

export class RegisterComponent implements OnInit{
	//Component varibles

	//register_form FormGroup to be used as a Model Driven Form
	private register_form:FormGroup;
	//usernameExists keeps track if the input username is already in use
	private usernameExists:Boolean;
	//emailExists keeps track if the input email is already in use
	private emailExists:Boolean;
	//submitRegister keeps track if the register_form has been submitted
	private submitRegister:Boolean;
	//loader is a boolean that whenever it's set to TRUE, the spinner animation on the Sign up button will be activated
	private loader:Boolean;

	//LoginComponent Constructor, FormBuilder reference, Router reference, RegisterService reference
	constructor(form_builder: FormBuilder, private router:Router, private service : RegisterService){
		this.usernameExists = false;
		this.emailExists = false;
		this.submitRegister = false;
		this.loader = false;
		//We set the validators and initial values of the fields contained within the register_form
	    this.register_form = form_builder.group({
	    	'email' : [null, Validators.compose([Validators.required, Validators.maxLength(100), Validators.email])],
	    	'username' : [null, Validators.compose([Validators.required, Validators.maxLength(25)])],
	    	'scope' : [null, Validators.compose([Validators.required])],
	    	'password' : [null, Validators.compose([Validators.required, Validators.maxLength(25), Validators.minLength(8)])],
	    	'confirm_password' : [null, Validators.compose([Validators.required, Validators.maxLength(25), Validators.minLength(8)])]
	    },{validator: this.matchingPasswords('password', 'confirm_password')})//We add our custom validator
	}

	//matchingPasswords is a custom validator that verifies if the password input matches the verify password input
	matchingPasswords = function(passwordKey: string, confirmPasswordKey: string) {
	  	return (group: FormGroup): {[key: string]: any} => {
		    let password = group.controls[passwordKey];
		    let confirmPassword = group.controls[confirmPasswordKey];
		    //verify if passwords match
		    if (password.value !== confirmPassword.value) {
			    return {//Return validator key:value
			        mismatchedPasswords: true
			    };
		    }
		}
	}

	
	ngOnInit() {
    }


    register(){
    	//if register_form is valid
    	if(this.register_form.valid){
    		//set loader animation to true
    		this.loader = true;
    		//set load to send to the backend server
    		var payload = {	email:this.register_form.controls['email'].value.toLowerCase(), 
    						username:this.register_form.controls['username'].value.toLowerCase(), 
    						password:this.register_form.controls['password'].value,
    						scope:this.register_form.controls['scope'].value};
    		//declare variable to store the endpoints response
    		var response;
    		//send load to register service function
    		this.service.register(payload).subscribe(
    			//store response
		        data => response = data[0].xteam_register,
		        err => {this.internalServerError();this.loader = false;},
		        ()=> {
		        	//after storing the response verify it's reply value
			        if(response == 0){//registration was successful
			        	this.registerSuccess();
			        }else if(response == 1){//username already exists
			        	this.usernameExists = true;
			        	this.usernameAlreadyExists();
			        }else if(response == 2){//email already exists
			        	this.emailExists = true;
			        	this.emailAlreadyExists();
			        }else{
			        	//unrecognized internal server error
			        	this.internalServerError();
			        }
			        //set loader animation to false
			        this.loader = false;
		    	}
		    );
    	}else{
    		//set submitRegister to true if register_form is not valid
    		this.submitRegister = true;
    	}
    	
  	}

  	//verifyEmailExsist(): Checks if the provided email already exists
  	verifyEmailExists(){
  		//set load to send to the backend server
  		if(this.register_form.controls['email'].value){
	  		var payload = {	email:this.register_form.controls['email'].value.toLowerCase()};
	  		//declare variable to store the endpoints response
			var response;
			//send load to email_exists service function
			this.service.email_exists(payload).subscribe(
				//store response
		        data => response = data[0].xteam_email_exists,
		        err => console.log(err),
		        ()=> {
		        	//after storing the response verify it's reply value
			        if(response == 1){//email exists
			        	this.emailExists = true;
			        }else if(response == 0){//email doesn't exist
			        	this.emailExists = false;
			        }
		    	}
		    );
		}
  	}
  	
  	//verifyUsernameExsist(): Checks if the provided username already exists
  	verifyUsernameExists(){
  		//set load to send to the backend server
  		if(this.register_form.controls['username'].value){
	  		var payload = {	username:this.register_form.controls['username'].value.toLowerCase()};
	  		//declare variable to store the endpoints response
			var response;
			//send load to username_exists
			this.service.username_exists(payload).subscribe(
				//store response
		        data => response = data[0].xteam_username_exists,
		        err => console.log(err),
		        ()=> {
		        	//after storing the response verify it's reply value
			        if(response == 1){//username exists
			        	this.usernameExists = true;
			        }else if(response == 0){//username doesn't exist
			        	this.usernameExists = false;
			        }
		    	}
		    );
		}
	}

  	//registerSuccess(): Alerts user if their registration was succesful, redirecting them to login route afterwards
  	registerSuccess() {
        swal({
            title: "Registered Successfully",
            text: "You can now log in into Makoto's App from the Sign in screen.",
            confirmButtonText: '<i class="fa fa-thumbs-up"></i> Sign in',
            allowOutsideClick: false,
            type: "success"
        }).then(
			()=>{
				this.router.navigate(['/login']);
			}
        );
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

    //usernameAlreadyExists(): Alerts the user if the username they provided already exists
    usernameAlreadyExists() {
    	swal({
            title: "Username Already Exists",
            text: "The provided username is already in use, please try a different one.",
            type: "error",
            allowOutsideClick: false
        }).catch(swal.noop)
    }

    //emailAlreadyExists(): Alerts the user if the email they provided already exists
    emailAlreadyExists() {
    	swal({
            title: "Email Already Exists",
            text: "The provided email is already in use, please try a different one.",
            type: "error",
            allowOutsideClick: false
        }).catch(swal.noop)
    }
}