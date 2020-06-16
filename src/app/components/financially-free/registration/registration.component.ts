import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApisService } from 'src/app/services/apis.service';
declare var $: any;
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  add_answer: FormGroup;
  user_details:FormGroup;
  submitted = false;
  submitted_user = false;
  loader = false;
  successmesage: any;
  errormessage: any;
  userdetails:any;
  constructor(private router: Router, private fb: FormBuilder, private apiservice: ApisService ) {
   this.user_details = this.fb.group({
    full_name: ["", [Validators.required,Validators.pattern('^[a-zA-Z \-\']+')]],
    email: ["", [Validators.required, Validators.email]],
    phone_number: ["", [Validators.required,Validators.maxLength(10)]],
    is_yes_bank_customer: ["", Validators.required]
   })

    this.add_answer = this.fb.group({
      answer:  ["", Validators.required]
    });
  }

 
  ngOnInit() {
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  get validation_function() {
    return this.add_answer.controls;
  }

  get validation_function_user() {
    return this.user_details.controls;
  }

  submit_user_userdetails({ valid, value }) {
    this.submitted_user = true;
    if (this.user_details.invalid) {
      return;
    } else {
      // console.log(JSON.stringify(value,null,2));
      this.userdetails = value;
      $('#details_form').toggle();
      $('#question_form').toggle();
    }
  }

  submit_answer({ valid, value }) {
    this.submitted = true;
    if (this.add_answer.invalid) {
      return;
    } else {
      // this.loader = true;
      console.log("Answer : "+JSON.stringify(value,null,2))
      var body = {
        full_name: this.userdetails.full_name,
        email: this.userdetails.email,
        phone_number: this.userdetails.phone_number,
        is_yes_bank_customer: this.userdetails.is_yes_bank_customer,
        referral_code:this.userdetails.referral_code,
        answer: value.answer, // *
        // session_id: req.body.session_id
      }
      this.successmesage = "Thankyou!";
      $('#message_modal').modal('show');
      // console.log("body : "+JSON.stringify(body,null,2));
          setTimeout(() => {
            $('#message_modal').modal('hide');
            this.router.navigate(['/polls']);
          }, 2000);
      // this.router.navigate(['/polls']);

      

      // $('#message_modal').modal('show');
      // this.successmesage = "Thankyou For Submitting Your Answer";
      // this.apiservice.add_answer(body).subscribe(api_response => {
      //   console.log("api response : "+JSON.stringify(api_response,null,2))
      //   if (api_response.status) {
      //     this.loader = false;
      //     console.log(JSON.stringify(api_response, null, 2))
      //     this.successmesage = api_response.success;
      //     $('#message_modal').modal('show');
      //     setTimeout(() => {
      //       $('#message_modal').modal('hide');
      //       // var id = window.btoa( api_response.info.self._id)
      //       this.router.navigate(['/polls']);
      //     }, 2000);

      //     this.router
      //   } else {
      //     this.loader = false;
      //     this.errormessage = api_response.errors;
      //     $('#message_modal').modal('show');
      //     setTimeout(() => {
      //       $('#message_modal').modal('hide');
      //     }, 2000);
      //   }
      // })
    }
  }


}
