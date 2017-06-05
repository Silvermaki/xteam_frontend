//Native Imports
import { Component, OnInit, ElementRef, Renderer, ViewChild, NgZone  } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms'; 
import { Router } from '@angular/router';

//Third Party Imports
import { default as swal } from 'sweetalert2';
import {ModalDirective} from 'ngx-bootstrap';
declare var pdfMake: any;

//Component Imports
import {XteamRequestService} from "../xteam_request/xteam_request.service";

@Component({
  selector: 'xteam_request',
  templateUrl: 'xteam_request.template.html'
})

export class XteamRequestComponent implements OnInit{
	 @ViewChild('send_request_pdf') sendRequestModal: ModalDirective;//send request modal reference
  	private request_form:FormGroup;//request FormGroup to be used as a Model Driven Form
	private submitStep1:Boolean;//is step1 from wizard submitted
    private submitStep2:Boolean;//is step2 from wizard submitted
    private submitStep3:Boolean;//is step3 from wizard submitted
    private step:number;//current wizard step
    private pdf:any;//pdf reference
    private sendLoader:Boolean;//boolean to activate loader animation
    private userId:String;//store logged in UserId
    //XteamRequestComponent Constructor FormBuilder reference, router reference, XteamService reference
	constructor(form_builder: FormBuilder,private router:Router, private service:XteamRequestService){
		//Initialize variables
		this.request_form = form_builder.group({
	      'challenge_answer' : [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
	      'first_name' : [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
	      'last_name' : [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
	      'profession' : [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
	      'motto' : [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
	      'question1' : [null, Validators.compose([Validators.required, Validators.maxLength(200)])],
	      'question2' : [null, Validators.compose([Validators.required, Validators.maxLength(200)])]
	    });
		this.userId = sessionStorage.getItem("userId");//set stored logged in UserId
		this.submitStep1=false;//initially false
	   	this.submitStep2=false;//initially false
	    this.submitStep3=false;//initially false
	    this.step = 1;//first step
	}

	ngOnInit() {
    }

    //sendRequest(): Send request by calling the newRequest function for the request service
    sendRequest(){
    	this.sendLoader = true;
		//set load to send to the backend server
		var payload = {	user_id:this.userId, 
						first_name:this.request_form.controls['first_name'].value, 
						last_name:this.request_form.controls['last_name'].value, 
						profession:this.request_form.controls['profession'].value,
						motto:this.request_form.controls['motto'].value,
						question1:this.request_form.controls['question1'].value,
						question2:this.request_form.controls['question2'].value};
		//declare variable to store the endpoints response
		var response;
		//send load to register service function
		this.service.newRequest(payload).subscribe(
			//store response
	        data => response = data[0].xteam_create_request,
	        err => {this.sendRequestModal.hide();this.internalServerError();this.sendLoader = false;},
	        ()=> {
	        	//after storing the response verify it's reply value
		        if(response == 0){//request was successful
		        	this.sendRequestModal.hide();
		        	this.requestSuccess();
		        }else{
		        	this.sendRequestModal.hide();
		        	this.internalServerError();
		        }
		        //set loader animation to false
		        this.sendLoader = false;
	    	}
	    );
    }

    //registerSuccess(): Alerts user if their registration was succesful, redirecting them to login route afterwards
  	requestSuccess() {
        swal({
            title: "Your Application Was Sent Successfully",
            text: "Your application will be reviewed by an X-Team Ambassador and will be notified of any resolution.",
            confirmButtonText: '<i class="fa fa-thumbs-up"></i> Awesome!',
            allowOutsideClick: false,
            type: "success"
        }).then(
			()=>{
				this.router.navigate(['/dashboard/my_requests']);
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

    //backToStep1(): Go back to step 1
    backToStep1(){
    	this.step = 1;
    }

    //backToStep2(): Go back to step 2
    backToStep2(){
        this.step = 2;
    }

    //backToStep3(): Go back to step 3
    backToStep3(){
        this.step = 3;
    }

    //goToStep3(): Verify information and go to next step or alert error on inputs
    goToStep2(){
    	if(this.request_form.controls['challenge_answer'].valid && this.request_form.controls['challenge_answer'].value =="hello world"){
    		this.step = 2;
    		this.submitStep1 = true;
    	}else{
    		this.submitStep1 = true;
    		this.step1Error();
    	}
    }

    //goToStep3(): Verify information and go to next step or alert error on inputs
    goToStep3(){
    	if(this.request_form.controls['first_name'].valid && this.request_form.controls['last_name'].valid && this.request_form.controls['profession'].valid && this.request_form.controls['motto'].valid){
    		this.step = 3;
    		this.submitStep2 = true;
    	}else{
    		this.submitStep2 = true;
    		this.step2Error();
    	}
    }

    //goToStep4(): Verify information and go to next step or alert error on inputs
    goToStep4(){
    	if(this.request_form.controls['question1'].valid && this.request_form.controls['question2'].valid){
    		this.step = 4;
    		this.submitStep3 = true;
    	}else{
    		this.submitStep3 = true;
    		this.step3Error();
    	}
    }

    //step1error(): Alert user if there's an error on step 1 of the wizard
    step1Error() {
	    swal({
	      title: "Oops... wrong answer!",
	      text: "Please try again.",
	      type: "error",
	      allowOutsideClick: false
	    }).catch(swal.noop)
	}

	//step2error(): Alert user if there's an error on step 2 of the wizard
	step2Error() {
	    swal({
	      title: "Oops... every field is required!",
	      text: "Please fill them up.",
	      type: "error",
	      allowOutsideClick: false
	    }).catch(swal.noop)
	}

	//step3error(): Alert user if there's an error on step 3 of the wizard
	step3Error() {
	    swal({
	      title: "Oops... both questions are required!",
	      text: "Please fill them up.",
	      type: "error",
	      allowOutsideClick: false
	    }).catch(swal.noop)
	}

	//generatePdf(): Frontend method to create a PDF off the request_form values
	generatePdf(){
        this.pdf = pdfMake;//pdfMake reference stored in pdf variable

        var docDefinition = {
            info: {
                title: 'X-Team Application',
                author: 'Makoto',
                subject: 'X-Team Application',
                keywords: 'X-Team Application',
                creator: 'Makoto',
                producer: 'Makoto'
            },
            pageSize: 'LETTER',
            pageOrientation: 'portrait',

            content: [
            	{text: "X-Team Job Application", style:'header'},
            	{text: "\n"},
            	{text: "Coding Challenge: ", style:'header2'},
            	{text: "I managed to complete the challenge!", style:'text'},
            	{text: "\n"},
            	{text: "First Name: ", style:'header2'},
            	{text: this.request_form.controls['first_name'].value, style:'text'},
            	{text: "\n"},
            	{text: "Last Name: ", style:'header2'},
            	{text: this.request_form.controls['last_name'].value, style:'text'},
            	{text: "\n"},
            	{text: "Profession: ", style:'header2'},
            	{text: this.request_form.controls['profession'].value, style:'text'},
            	{text: "\n"},
            	{text: "Motto: ", style:'header2'},
            	{text: this.request_form.controls['motto'].value, style:'text'},
            	{text: "\n"},
            	{text: "Have you worked remotely before?", style:'header2'},
            	{text: this.request_form.controls['question1'].value, style:'text'},
            	{text: "\n"},
            	{text: "What do you expect from us?", style:'header2'},
            	{text: this.request_form.controls['question2'].value, style:'text'},
            	{text: "\n"}
            ],

            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    alignment: 'center'
                },
                header2: {
                    fontSize: 14,
                    bold: true,
                    alignment: 'left'
                },
                text: {
                    fontSize: 12
                }
            }
        }

        //Set iframe source to pdf blob data
        this.pdf.createPdf(docDefinition).getDataUrl(function (outDoc) {
               document.getElementById('pdfFrame').setAttribute('src',outDoc);
        });
    }
}