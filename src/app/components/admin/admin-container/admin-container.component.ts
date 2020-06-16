import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-container',
  templateUrl: './admin-container.component.html',
  styleUrls: ['./admin-container.component.css']
})
export class AdminContainerComponent implements OnInit {

  constructor(private router : Router) { }

  ngOnInit() {
    this.check_auth()
  }

  check_auth(){
    var auth_token = sessionStorage.getItem('admin_auth_token');
    if(!auth_token){
      this.router.navigate(['/admin'])
    }
  }
}
