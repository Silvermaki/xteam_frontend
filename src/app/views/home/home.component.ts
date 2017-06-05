//Native Imports
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms'; 
import { Router } from '@angular/router';

//Third Party Libraries Imports
import { default as swal } from 'sweetalert2';

//Providers Improts
import { HomeService } from './home.service';

@Component({
  selector: 'home',
  templateUrl: 'home.template.html'
})


export class HomeComponent implements OnInit{
	//Component Variables
	private userName:String;//store logged in Username
	private userEmail:String;//store logged in Email
	private userScope:String;//store logged in Scope
	private userId:String;//store logged in UserId
	private notificationsOffsetLeft:number;//offset to keep track of left end of notifications browsing
	private notificationsOffsetRight:number;//offset to keep track of right end of notifications browsing
	private notifications:any;

	constructor(private router:Router, private service : HomeService){
		this.userName = sessionStorage.getItem("userName");//set stored logged in Username
	    this.userEmail = sessionStorage.getItem("userEmail");//set stored logged in Email
	    this.userScope = sessionStorage.getItem("userScope");//set stores logged in Scope
	    this.userId = sessionStorage.getItem("userId");//set stored logged in UserId
	    this.notificationsOffsetLeft = 0;//set as 0
	    this.notificationsOffsetRight = 0;//set as 0
	    this.notifications = [];//set notifications empty
	}

	ngOnInit() {
		//get notifications when ng load
		this.getNotifications();

    }

    //UpdateNotificationGoRight(): Update notification offsets when user clicks right arrow
    updateNotificationsGoRight(){
    	if(this.notifications.length > 0){
	    	//Verify if notificationsOffsetRight overloads notifications length
	    	if(this.notifications.length< this.notificationsOffsetRight+5){
				this.notificationsOffsetRight = this.notifications.length;
			}else{//if not, set to 5
				this.notificationsOffsetRight = this.notificationsOffsetRight + 5;
			}
			this.notificationsOffsetLeft = this.notificationsOffsetLeft + 5;
	    }
    }

    //UpdateNotificationGoLeft(): Update notification offsets when user clicks left arrow
    updateNotificationsGoLeft(){
    	if(this.notifications.length > 0){
    		//check if last element
    		if(this.notifications.length == this.notificationsOffsetRight){
				this.notificationsOffsetLeft = this.notificationsOffsetLeft - 5;
				this.notificationsOffsetRight = this.notificationsOffsetLeft + 4;
			}else{//if not last element
		    	this.notificationsOffsetLeft = this.notificationsOffsetLeft - 5;
		    	this.notificationsOffsetRight = this.notificationsOffsetRight - 5;
	    	}
	    }
    }


    //Compare object to order notifications in newest first fashion
    compare(a,b) {
	  if (a.id_notification > b.id_notification)
	    return -1;
	  if (a.id_notification < b.id_notification)
	    return 1;
	  return 0;
	}

    getNotifications(){
    	//set load to send to the backend server
        var payload = {userid:this.userId};
        //declare variable to store the endpoints response
        var response;
        //send load to getNotifications service function
        this.service.get_notifications(payload).subscribe(
        	//store response
            data => response = data[0].xteam_get_notifications,
            err => console.log(err),
            ()=> {
                if(response){//if not null
                    this.notifications = response;
                    if(this.notifications.length > 0){
                    	//Verify if notificationsOffsetRight overloads notifications length
                    	if(this.notifications.length < this.notificationsOffsetRight+5){
	    					this.notificationsOffsetRight = this.notifications.length;
		    			}else{//if not, set to 5
		    				this.notificationsOffsetRight = 5;
		    			}
		    			this.notificationsOffsetLeft = 1;
		    			//Sort notifications using compare object
		    			this.notifications.sort(this.compare);
                    }
                }else{
                	//set notifications as empty
                    this.notifications = [];

                }
               
            }
        );
    }
}