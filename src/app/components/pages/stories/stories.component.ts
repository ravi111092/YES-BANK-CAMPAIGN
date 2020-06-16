import { Component, OnInit } from '@angular/core';
import { ApisService } from 'src/app/services/apis.service';
import * as config from "../../../../../config";
declare var $: any;
@Component({
  selector: 'app-stories',
  templateUrl: './stories.component.html',
  styleUrls: ['./stories.component.css']
})
export class StoriesComponent implements OnInit {
  status_data: any;
  base_path: any;
  loading: any;
  status_name: any;
  status_description: any;
  status_image:any;
  constructor(private apiservice: ApisService) { }

  ngOnInit() {
    this.get_all_stories();
    // this.base_path = config.env == "prod" ? "https://yescelebrate.yesbank.in/story_images/" : "http://localhost:3000/story_images/";
    this.base_path = config.env == "prod" ? "http://13.232.227.82/story_images/" : "http://localhost:3000/story_images/";
    sessionStorage.clear();
  }

  get_all_stories() {
    this.loading = true;
    var body = {}
    this.apiservice.get_all_stories(body).subscribe(api_response => {
      if (api_response.status) {
        // console.log("data success: "+JSON.stringify(api_response, null,2));
        this.status_data = api_response.info.stories.reverse();
        // console.log(this.status_data.length)
        this.loading = false;
      } else {
        // console.log("data error: "+JSON.stringify(api_response, null,2))
      }
    })
  }

  mouseEnter(index) {
    $("#overlay" + index).toggle();
  }
  mouseLeave(index) {
    $("#overlay" + index).toggle();
  }


  show_more_data(status) {
    this.status_name = status.name;
    this.status_description = status.description;
    this.status_image = status.image;
  }
}
