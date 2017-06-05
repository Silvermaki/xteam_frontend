//Native Imports
import { Component, OnInit, ElementRef, Renderer, ViewChild, NgZone  } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms'; 
import { Router } from '@angular/router';

//Third Party Imports
import { default as swal } from 'sweetalert2';
import {ModalDirective} from 'ngx-bootstrap';
declare var pdfMake: any;

//Component Imports
import {MyRequestsService} from "../my_requests/my_requests.service";

@Component({
  selector: 'my_requests',
  templateUrl: 'my_requests.template.html'
})

export class MyRequestsComponent implements OnInit{

    private userId:String;//store logged in UserId
    private pdf:any;//pdf reference
    private requests:any;//variable to store requests
    private requestOffsetRight:number;//requestTable offset to control request browsing
    private requestOffsetLeft:number;//requestTable offset to control request browsing
    //XteamRequestComponent Constructor FormBuilder reference, router reference, XteamService reference
	constructor(private router:Router, private service:MyRequestsService){
		//Initialize variables
        this.requests = [];//initially empty
        this.userId = sessionStorage.getItem("userId");//store logged in UserId
        this.requestOffsetRight = 0;//set as 0
        this.requestOffsetLeft = 0;//set as 0
	}

	ngOnInit() {
        //get requests on load
        this.getRequests();
    }


    getRequests(){
        //set load to send to the backend server
        var payload = {userid:this.userId};
        //declare variable to store the endpoints response
        var response;
        //send load to getRequests service function
        this.service.get_user_requests(payload).subscribe(
            //store response
            data => response = data[0].xteam_get_requests_user,
            err => console.log(err),
            ()=> {
                if(response){//if not null
                    this.requests = response;
                    if(this.requests.length > 0){
                        //Verify if requestOffsetRight overloads requests length
                        if(this.requests.length < this.requestOffsetRight+5){
                            this.requestOffsetRight = this.requests.length;
                        }else{//if not, set to 5
                            this.requestOffsetRight = 5;
                        }
                        this.requestOffsetLeft = 1;
                        //Sort requests using compare object
                        this.requests.sort(this.compare);
                    }
                }else{
                    //set requests as empty
                    this.requests = [];

                }
               
            }
        );
    }

    //updateRequestsGoRight(): Update request offsets when user clicks right arrow
    updateRequestsGoRight(){
        if(this.requests.length > 0){
            //Verify if requestOffsetRight overloads requests length
            if(this.requests.length< this.requestOffsetRight+5){
                this.requestOffsetRight = this.requests.length;
            }else{//if not, set to 5
                this.requestOffsetRight = this.requestOffsetRight + 5;
            }
            this.requestOffsetLeft = this.requestOffsetLeft + 5;
        }
    }

    //updateRequestsGoLeft(): Update requests offsets when user clicks left arrow
    updateRequestsGoLeft(){
        if(this.requests.length > 0){
            //check if last element
            if(this.requests.length == this.requestOffsetRight){
                this.requestOffsetLeft = this.requestOffsetLeft - 5;
                this.requestOffsetRight = this.requestOffsetLeft + 4;
            }else{//if not last element
                this.requestOffsetLeft = this.requestOffsetLeft - 5;
                this.requestOffsetRight = this.requestOffsetRight - 5;
            }
        }
    }

    //compare requests
    compare(a,b) {
      if (a.id_request > b.id_request)
        return -1;
      if (a.id_request < b.id_request)
        return 1;
      return 0;
    }
	//generatePdf(): Frontend method to create a PDF off the request_form values
	generatePdf(first_name, last_name, profession, motto, question1, question2){
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
            	{text: first_name, style:'text'},
            	{text: "\n"},
            	{text: "Last Name: ", style:'header2'},
            	{text: last_name, style:'text'},
            	{text: "\n"},
            	{text: "Profession: ", style:'header2'},
            	{text: profession, style:'text'},
            	{text: "\n"},
            	{text: "Motto: ", style:'header2'},
            	{text: motto, style:'text'},
            	{text: "\n"},
            	{text: "Have you worked remotely before?", style:'header2'},
            	{text: question1, style:'text'},
            	{text: "\n"},
            	{text: "What do you expect from us?", style:'header2'},
            	{text: question2, style:'text'},
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