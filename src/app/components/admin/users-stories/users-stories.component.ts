import { Component, OnInit } from '@angular/core';
import { ApisService } from 'src/app/services/apis.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as config from "../../../../../config";
@Component({
  selector: 'app-users-stories',
  templateUrl: './users-stories.component.html',
  styleUrls: ['./users-stories.component.css']
})
export class UsersStoriesComponent implements OnInit {
  p: number = 1;
  stories_data: any;
  total_stories_count: any;
  email: any;
  success_message: any;
  error_message: any;
  success_alert = false;
  error_alert = false;
  basepath: any;
  story_name: any;
  story_description: any;
  story_image: any;
  preview_data = false;
  constructor(private apiservice: ApisService, private router: Router, private activated_route: ActivatedRoute) {
    this.activated_route.queryParams.subscribe(params => {
      this.email = params['email']
    })
  }

  ngOnInit() {
    this.stories();
  }

  stories() {
    var body = {
      email: this.email
    }

    this.apiservice.get_campaign_one_stories_by_email(body).subscribe(api_response => {
      if (api_response.status && api_response.info.stories.length > 0) {
        // console.log("stories success : " + JSON.stringify(api_response, null, 2));
        this.basepath = config.env == "prod" ? "https://yescelebrate.yesbank.in/story_images/" : "http://localhost:3000/story_images/";
        // this.basepath = config.env == "prod" ? "http://13.232.227.82/story_images/" : "http://localhost:3000/story_images/";
        this.stories_data = api_response.info.stories;
        this.total_stories_count = api_response.info.stories.length;
        this.preview_data = true;
      } else {
        this.preview_data = false;
        console.log("stories error : " + JSON.stringify(api_response, null, 2))
      }
    })
  }

  show_data(story) {
    this.story_name = story.name;
    this.story_description = story.description;
    this.story_image = story.image;
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
        this.stories();
        setTimeout(() => {
          this.success_alert = false
        }, 2000);
      } else {
        this.error_alert = true
        this.error_message = api_response.success;
        this.stories();
        setTimeout(() => {
          this.error_alert = false
        }, 2000);
      }
    })
  }
}
