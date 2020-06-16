import { Component, OnInit } from '@angular/core';
import { ApisService } from 'src/app/services/apis.service';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { stringify } from 'querystring';
@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  login_from: FormGroup;
  submitted = false;
  error_message: any;
  show_error = false;
  sub: any;
  error_alert: any;
  constructor(private fb: FormBuilder, private apiservice: ApisService, private router: Router) {
    this.login_from = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required]
    });
  }

  ngOnInit() {
  }

  get validation_function() {
    return this.login_from.controls;
  }

  on_submit_login_form({ valid, value }) {
    this.submitted = true;
    if (this.login_from.invalid) {
      return;
    } else {
      var body = {
        email: value.email,
        password: value.password
      }
      this.apiservice.admin_login(body).subscribe(api_response => {
        // console.log(JSON.stringify(api_response, null, 2));
        if (api_response.status) {
          sessionStorage.setItem('admin_auth_token',api_response.info.auth_token);
          sessionStorage.setItem('adminDetails',api_response.info.user);
          this.router.navigate(['/admin/stories']);
        } else {
          this.error_alert = true;
          this.error_message = api_response.errors;
          setTimeout(() => {
            this.error_alert = false
          }, 2000);
        }
      })
    }
  }
}
