import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApisService } from 'src/app/services/apis.service';
import * as config from "../../../../../../config";
import * as XLSX from "xlsx";
@Component({
  selector: 'app-admin-all-answers',
  templateUrl: './admin-all-answers.component.html',
  styleUrls: ['./admin-all-answers.component.css']
})
export class AdminAllAnswersComponent implements OnInit {
  p: number = 1;
  all_answers:any;
  success_alert:any;
success_message:any;
error_alert:any;
error_message:any;
showme_data:any;
full_name:any;
email : any;
phone_number:any;
text:any;
total_count:any;
  constructor(private router: Router, private apiservice: ApisService) { }

  ngOnInit() {
    this.get_campaign_three_answers();
  }

  get_campaign_three_answers(){
    this.apiservice.get_campaign_three_answers().subscribe(api_response => {
    
      if(api_response.status && api_response.info.answers.length > 0){
        console.log("api_response : "+JSON.stringify(api_response,null,2));
        this.all_answers = api_response.info.answers;
        this.total_count = api_response.info.answers.length;
      }else{
        console.log("empty")
      }
    })
  }

  isHidden(_id){
    var body = {
      _id: _id
    }
    this.apiservice.toggle_campaign_three_answer_status(body).subscribe(api_response => {
      if (api_response.status) {
        // console.log(JSON.stringify(api_response,null,2));
        this.success_alert = true
        this.success_message = api_response.success;
        this.get_campaign_three_answers();;
        setTimeout(() => {
          this.success_alert = false
        }, 2000);
      } else {
        this.error_alert = true
        this.error_message = api_response.success;
        this.get_campaign_three_answers();
        setTimeout(() => {
          this.error_alert = false
        }, 2000);
      }
    })
  }

  show_data(data){

    console.log(JSON.stringify(data,null,2));
    this.full_name = data.full_name;
    this.email = data.email;
    this.phone_number = data.phone_number;
    this.text = data.text;
  }
}
