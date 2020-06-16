import { Component, OnInit } from '@angular/core';
import { ApisService } from 'src/app/services/apis.service';
import * as XLSX from "xlsx";
import { $ } from 'protractor';
import { Router } from '@angular/router';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  p: number = 1;
  users_data: any;
  loopable_data: any;
  loopable_data_with_stories:any;
  loopable_data_without_stories:any;
  total_count: any;
  stories_data: any;
  total_stories_count: any;
  widthout_stories:any;
  constructor(private apiservice: ApisService, private router : Router) { }

  ngOnInit() {
    this.get_campaign_one_users();
    // this.get_campaign_one_users_without_stories();
  }


  get_campaign_one_users() {
    this.apiservice.get_campaign_one_users().subscribe(api_response => {
      if (api_response.status) {
        // console.log(JSON.stringify(api_response, null, 2));
        this.users_data = api_response.info.users.reverse();
        this.total_count = api_response.info.users.length;
      } else {
        console.log("api_response error: "+JSON.stringify(api_response,null,2))
      }
    })
  }

  show_stories(user_email) {
    this.router.navigate(['/admin/user_story'], { queryParams: { email: user_email } });
  }

  get_campaign_one_users_with_stories(){
    this.apiservice.get_campaign_one_users_with_stories().subscribe(api_response => {
      if(api_response.status){
        // console.log("api_response success: "+JSON.stringify(api_response,null,2));
        this.users_data = api_response.info.users.reverse();
        console.log(this.users_data);
        this.total_count = api_response.info.users.length;
      }else{
        console.log("api_response error: "+JSON.stringify(api_response,null,2))
      }
    })
  }

  get_campaign_one_users_without_stories(){
    this.apiservice.get_campaign_one_users_without_stories().subscribe(api_response => {
      if(api_response.status){
        // console.log("api_response success: "+JSON.stringify(api_response,null,2));
        this.users_data = api_response.info.users.reverse();
        this.total_count = api_response.info.users.length;
      }else{
        console.log("api_response error: "+JSON.stringify(api_response,null,2))
      }
    })
  }

  // downloadExcelSheet_widthout_stories(){
    
  //   this.loopable_data_without_stories = this.widthout_stories;
  //   var downloadable_data = [];
  //   for (var i = 0; i < this.loopable_data_without_stories.length; i++) {
  //     downloadable_data.push({
  //       Name: this.loopable_data_without_stories[i].full_name ? this.loopable_data_without_stories[i].full_name : '-',
  //       Email: this.loopable_data_without_stories[i].email ? this.loopable_data_without_stories[i].email : '-',
  //       PhoneNumber: this.loopable_data_without_stories[i].phone_number ? this.loopable_data_without_stories[i].phone_number : '-',
  //       YesBankCustomer: this.loopable_data_without_stories[i].is_yes_bank_customer ? 'Yes' : 'No',
  //     })
  //   }

  //   console.log(JSON.stringify(downloadable_data, null, 2))
  //   const workBook = XLSX.utils.book_new(); // create a new blank book
  //   const workSheet = XLSX.utils.json_to_sheet(downloadable_data);

  //   XLSX.utils.book_append_sheet(workBook, workSheet, "data"); // add the worksheet to the book
  //   XLSX.writeFile(workBook, "UsersWithoutStories.xlsx"); // initiate a file download in browser
  // }


  export_all_users() {
    this.apiservice.get_campaign_one_users().subscribe(api_response => {
      if (api_response.status) {
        this.loopable_data= api_response.info.users;
        var downloadable_data = [];
        for (var i = 0; i < this.loopable_data.length; i++) {
          downloadable_data.push({
            Name: this.loopable_data[i].full_name ? this.loopable_data[i].full_name : '-',
            Email: this.loopable_data[i].email ? this.loopable_data[i].email : '-',
            PhoneNumber: this.loopable_data[i].phone_number ? this.loopable_data[i].phone_number : '-',
            YesBankCustomer: this.loopable_data[i].is_yes_bank_customer ? 'Yes' : 'No',
            ReferralCode: this.loopable_data[i].referral_code
          })
        }
    
        // console.log(JSON.stringify(downloadable_data, null, 2))
        const workBook = XLSX.utils.book_new(); // create a new blank book
        const workSheet = XLSX.utils.json_to_sheet(downloadable_data);
    
        XLSX.utils.book_append_sheet(workBook, workSheet, "data"); // add the worksheet to the book
        XLSX.writeFile(workBook, "Users.xlsx"); // initiate a file download in browser
      }
    })
  }

  export_users_with_stories() {
    this.apiservice.get_campaign_one_users_with_stories().subscribe(api_response => {
      if (api_response.status) {
        this.loopable_data_with_stories= api_response.info.users;
        var downloadable_data = [];
       // console.log("with stories length:"+JSON.stringify(this.loopable_data_with_stories));
        for (var i = 0; i < this.loopable_data_with_stories.length; i++) {
          downloadable_data.push({
            Name: this.loopable_data_with_stories[i].full_name ? this.loopable_data_with_stories[i].full_name : '-',
            Email: this.loopable_data_with_stories[i].email ? this.loopable_data_with_stories[i].email : '-',
            PhoneNumber: this.loopable_data_with_stories[i].phone_number ? this.loopable_data_with_stories[i].phone_number : '-',
            YesBankCustomer: this.loopable_data_with_stories[i].is_yes_bank_customer ? 'Yes' : 'No',
            ReferralCode: this.loopable_data_with_stories[i].referral_code,
            StoryName:this.loopable_data_with_stories[i].story_name,
            Story:this.loopable_data_with_stories[i].story_description,
          })
        }
    
        // console.log(JSON.stringify(downloadable_data, null, 2))
        const workBook = XLSX.utils.book_new(); // create a new blank book
        const workSheet = XLSX.utils.json_to_sheet(downloadable_data);
    
        XLSX.utils.book_append_sheet(workBook, workSheet, "data"); // add the worksheet to the book
        XLSX.writeFile(workBook, "UsersWithStories.xlsx"); // initiate a file download in browser
      }
    })
  }

  export_users_without_stories(){
    this.apiservice.get_campaign_one_users_without_stories().subscribe(api_response => {
      if (api_response.status) {
        this.loopable_data_without_stories= api_response.info.users;
        var downloadable_data = [];
        console.log("without stories length:"+this.loopable_data_without_stories.length)
        for (var i = 0; i < this.loopable_data_without_stories.length; i++) {
          downloadable_data.push({
            Name: this.loopable_data_without_stories[i].full_name ? this.loopable_data_without_stories[i].full_name : '-',
            Email: this.loopable_data_without_stories[i].email ? this.loopable_data_without_stories[i].email : '-',
            PhoneNumber: this.loopable_data_without_stories[i].phone_number ? this.loopable_data_without_stories[i].phone_number : '-',
            YesBankCustomer: this.loopable_data_without_stories[i].is_yes_bank_customer ? 'Yes' : 'No',
            ReferralCode: this.loopable_data_without_stories[i].referral_code
          })
        }
    
        // console.log(JSON.stringify(downloadable_data, null, 2))
        const workBook = XLSX.utils.book_new(); // create a new blank book
        const workSheet = XLSX.utils.json_to_sheet(downloadable_data);
    
        XLSX.utils.book_append_sheet(workBook, workSheet, "data"); // add the worksheet to the book
        XLSX.writeFile(workBook, "UsersWithOutStories.xlsx"); // initiate a file download in browser
      }
    })
  }

}
