import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApisService } from 'src/app/services/apis.service';
import * as config from "../../../../../config";
import * as XLSX from "xlsx";
@Component({
  selector: 'app-admin-stories',
  templateUrl: './admin-stories.component.html',
  styleUrls: ['./admin-stories.component.css']
})
export class AdminStoriesComponent implements OnInit {
  p: number = 1;
  status_data: any;
  basepath: any;
  loopable_data: any;
  success_message: any;
  error_message: any;
  success_alert = false;
  error_alert = false;
  total_count: any;
  story_name: any;
  story_description: any;
  story_image: any;
  constructor(private router: Router, private apiservice: ApisService) { }

  ngOnInit() {
    this.get_campaign_one_stories();

  }


  get_campaign_one_stories() {
    this.apiservice.get_campaign_one_stories().subscribe(api_response => {
      // console.log("data success: " + JSON.stringify(api_response, null, 2));
      if (api_response.status) {
        this.basepath = config.env == "prod" ? "https://yescelebrate.yesbank.in/story_images/" : "http://localhost:3000/story_images/";
        // this.basepath = config.env == "prod" ? "http://13.232.227.82/story_images/" : "http://localhost:3000/story_images/";
        // console.log("data success: " + JSON.stringify(api_response, null, 2));
        this.status_data = api_response.info.stories.reverse();
        this.total_count = api_response.info.stories.length;
        // console.log(this.status_data.length)
      } else {
        // console.log("data error: "+JSON.stringify(api_response, null,2))
      }
    })
  }

  isHidden(_id) {
    var body = {
      _id: _id
    }
    this.apiservice.toggle_campaign_one_story_status(body).subscribe(api_response => {
      if (api_response.status) {
        // console.log(JSON.stringify(api_response,null,2));
        this.success_alert = true
        this.success_message = api_response.success;
        this.get_campaign_one_stories();
        setTimeout(() => {
          this.success_alert = false
        }, 2000);
      } else {
        this.error_alert = true
        this.error_message = api_response.success;
        this.get_campaign_one_stories();
        setTimeout(() => {
          this.error_alert = false
        }, 2000);
      }
    })
  }

  downloadExcelSheet() {

    this.loopable_data = this.status_data;
    var downloadable_data = [];
    for (var i = 0; i < this.loopable_data.length; i++) {
      downloadable_data.push({
        Name: this.loopable_data[i].name ? this.loopable_data[i].name : '-',
        Image: this.loopable_data[i].image ? this.loopable_data[i].image : '-',
        Description: this.loopable_data[i].description ? this.loopable_data[i].description : '-',
        Email: this.loopable_data[i].email ? this.loopable_data[i].email : '-',
        Hidden: this.loopable_data[i].is_hidden ? 'Yes' : 'No',
        Date: this.loopable_data[i].created_at ? new Date(this.loopable_data[i].created_at) : 'No',
      })
    }

    // console.log(JSON.stringify(downloadable_data,null,2))
    const workBook = XLSX.utils.book_new(); // create a new blank book
    const workSheet = XLSX.utils.json_to_sheet(downloadable_data);

    XLSX.utils.book_append_sheet(workBook, workSheet, "data"); // add the worksheet to the book
    XLSX.writeFile(workBook, "Stories.xlsx"); // initiate a file download in browser
  }


  show_data(story) {
    this.story_name = story.name;
    this.story_description = story.description;
    this.story_image = story.image;
  }
}
