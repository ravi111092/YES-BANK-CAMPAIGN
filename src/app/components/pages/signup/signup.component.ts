import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { ApisService } from 'src/app/services/apis.service';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  signup_form: FormGroup;
  description_form: FormGroup;
  error_message: any;
  submitted = false;
  submitted_upload = false;
  show_error = false;
  show_success = false;
  success_message: any;
  user_email: any;
  show_resend_message: any;
  show_resend_message_success: any
  show_resend_message_error: any
  show_resend_success = false;
  show_resend_error = false;
  loading = false;
  file_error: any;
  sessionTime: any;
  counter = 0;
  interval: any;
  image_show: any;
  imagesToUpload: any;
  email: any;
  show_alert_success: any;
  show_alert_error: any;
  registration_details:any;
  constructor(private fb: FormBuilder, private apiservice: ApisService, private authService: AuthService, private router: Router) {
    this.signup_form = this.fb.group({
      full_name: ["", [Validators.required, Validators.pattern('^[a-zA-Z \-\']+')]],
      email: ["", [Validators.required, Validators.email]],
      phone_number: ["", [Validators.required, Validators.maxLength(10)]],
      is_yes_bank_customer: ["", Validators.required],
      referral_code: ["", Validators.maxLength(7)]
    });

    this.description_form = this.fb.group({
      image: [''],
      description: ["", Validators.required],
      name: ['', Validators.required]
    });
  }

  ngOnInit() {
    // this.create_session_id(50)
    // this.interval = setInterval(() => {
    //   this.submitDummyvalue();
    // }, 3000)

  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  get validation_function() {
    return this.signup_form.controls;
  }

  on_submit_signup_form({ valid, value }) {

    this.submitted = true;
    if (this.signup_form.invalid) {
      return;
    } else {

      
      var body = {
        full_name: value.full_name,
        email: value.email,
        phone_number: value.phone_number,
        is_yes_bank_customer: value.is_yes_bank_customer,
        referral_code: value.referral_code
      }
      this.registration_details = body;
           $(".signup_form").toggle();
          $(".upload_form").toggle();
    }

  }


  // submitDummyvalue() {
  //   this.counter++
  //   // console.log(this.counter)
  //   if (this.counter < 31) {
  //     //  console.log(sessionStorage.getItem('session_id'));
  //     var body = {
  //       session_id: sessionStorage.getItem('session_id'),
  //       full_name: $('#full_name').val(),
  //       email: $('#email').val(),
  //       phone_number: $('#phone_number').val(),
  //       is_yes_bank_customer: $('input[name=is_yes_bank_customer]:checked').val(),
  //       referral_code: $('#referral_code').val()
  //     }
  //     console.log(JSON.stringify(body, null, 2));

  //     this.apiservice.registration_temp(body).subscribe(api_response => {
  //       //  console.log("api_response : "+JSON.stringify(api_response,null,2))
  //     })
  //   } else {
  //     clearInterval(this.interval);
  //   }
  // }

  // create_session_id(length) {
  //   var result = '';
  //   var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  //   var charactersLength = characters.length;
  //   for (var i = 0; i < length; i++) {
  //     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  //   }
  //   // return result;
  //   // console.log(result);
  //   sessionStorage.setItem('session_id', result)
  // }

  ngOnDestroy() {
    // clearInterval(this.interval)

  }

  onFileChange(fileInput: any) {
    this.image_show = [];

    let files = fileInput.target.files;
    // console.log(files);
    for (let file of files) {
      if (file.type != "image/jpeg" && file.type != "image/gif" && file.type != "image/png") {
        this.file_error = "File type is not supported";
        this.image_show = [];
      } else {
        this.imagesToUpload = <Array<File>>fileInput.target.files;
        this.file_error = ""
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.image_show.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }

    }
  }

  get validation_function_upload() {
    return this.description_form.controls;
  }

  onsubmit({ valid, value }) {
   
   
    this.submitted_upload = true;
    if (this.description_form.invalid) {
      return;
    } else {
      console.log("this.registration_details : "+this.registration_details.full_name);
      this.loading = true;
      // console.log("value : " + JSON.stringify(value, null, 2));
      const formdata = new FormData();
      if (this.imagesToUpload) {
        for (let i = 0; i < this.imagesToUpload.length; i++) { formdata.append("files", this.imagesToUpload[i], this.imagesToUpload[i]["name"]); }
      } else {
        formdata.append("files", "");
      }
      formdata.append('full_name',this.registration_details.full_name);
      formdata.append('email', this.registration_details.email);
      formdata.append('phone_number', this.registration_details.phone_number);
      formdata.append('is_yes_bank_customer', this.registration_details.is_yes_bank_customer);
      formdata.append('referral_code', this.registration_details.referral_code);
      formdata.append('description', value.description);
      formdata.append('name', value.name);
      this.apiservice.add_story_V2(formdata).subscribe(api_response => {
        if (api_response.status) {
          console.log("Success"+JSON.stringify(api_response,null,2));
          this.description_form.reset();
          this.image_show = false;
          this.show_alert_success = true;
          this.success_message = api_response.success;

          this.loading = false;
          $('#confirmation_modal').modal('show');
          setTimeout(() => {
            this.show_alert_success = false;

          }, 2000);
        } else {
          this.loading = false;
          this.show_alert_error = true;
          this.error_message = api_response.errors;
          setTimeout(() => {
            this.show_alert_error = false;
          }, 2000);
        }
      })
    }
  }

  takemeToMosaic(){
    window.location.href = "/mosaic"
  }

  openavis(){
    window.open(
      'https://www.avis.co.in/?utm_source=Yes_Bank&utm_medium=Alliance_Yes_Bank&utm_campaign=Yes_Alliance',
      '_blank' // <- This is what makes it open in a new window.
    );
    // window.location.href = "https://www.avis.com/en/amp/home"
  }
}
