import { Component, OnInit } from '@angular/core';
import { ApisService } from 'src/app/services/apis.service';
import * as config from "../../../../../config";
declare var $: any;
@Component({
  selector: 'app-all-answers',
  templateUrl: './all-answers.component.html',
  styleUrls: ['./all-answers.component.css']
})
export class AllAnswersComponent implements OnInit {

  constructor(private apiservice: ApisService) { }

  ngOnInit() {
    this.get_all_answers();
  }
  get_all_answers(){
    var body = {}
    this.apiservice.get_all_answers(body).subscribe(api_response => {
      console.log("Api_response : "+JSON.stringify(api_response,null,2))
    })

  }
}
