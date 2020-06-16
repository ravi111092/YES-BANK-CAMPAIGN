import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { environment } from '../environments/environment';
import * as config from "../../config";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'yesbank';
  location:Location;
  ngOnInit() {
    // production
    // if (config.env == "prod") {
    //   if (location.protocol === 'http:') {
    //    window.location.href = location.href.replace('http', 'https');
    //   }
    //  }  
  }

}
