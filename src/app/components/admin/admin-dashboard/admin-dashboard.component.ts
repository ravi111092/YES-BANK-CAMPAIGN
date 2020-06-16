import { Component, OnInit } from '@angular/core';
import { ApisService } from 'src/app/services/apis.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  total_user:any;
  total_stories:any;
  total_stories_hidden : any;
  total_stories_unhidden : any;
  total_yes_bank_users : any;
  constructor(private apiservice : ApisService) { }

  ngOnInit() {
    this.get_campaign_one_users();
    this.get_campaign_one_stories();
  }

  get_campaign_one_users(){
    var yesbankcustomer = [];
    this.apiservice.get_campaign_one_users().subscribe(api_response => {
      if(api_response.status){
        console.log(JSON.stringify(api_response,null,2));
        this.total_user = api_response.info.users.length;
        for(var i = 0 ; i < api_response.info.users.length; i++){
          if(api_response.info.users[i].is_yes_bank_customer === 1){
            yesbankcustomer.push(api_response.info.users[i].is_yes_bank_customer)
          }
        }
        this.total_yes_bank_users = yesbankcustomer.length;
      }
    })
  }

  get_campaign_one_stories() {
    var hidden = [];
    var unhidden = [];
    this.apiservice.get_campaign_one_stories().subscribe(api_response => {
      if (api_response.status) {
        this.total_stories = api_response.info.stories.length;
        for(var i = 0; i < api_response.info.stories.length ; i++){
          if(api_response.info.stories[i].is_hidden === 1){
            hidden.push(api_response.info.stories[i].is_hidden)
          }else{
            unhidden.push(api_response.info.stories[i].is_hidden)
          }
           this.total_stories_hidden = hidden.length;
           this.total_stories_unhidden = unhidden.length;
        }
      }
    })
  }

}
