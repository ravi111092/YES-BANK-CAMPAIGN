import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApisService } from 'src/app/services/apis.service';
declare var $: any;
@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.css']
})
export class UploadImageComponent implements OnInit, OnDestroy {
  description_form: FormGroup;
  image_show: any;
  imagesToUpload: any;
  submitted = false;
  success_message: any;
  error_message: any;
  show_alert_success = false;
  show_alert_error: any;
  status_data: any;
  base_path: any;
  email: any;
  loading = false;
  file_error: any;
  session_id: any;
  counter = 0;
  interval: any;
  constructor(private fb: FormBuilder, private apiservice: ApisService, private router: Router, private activated_route: ActivatedRoute) {

    this.description_form = this.fb.group({
      image: [''],
      description: ["", Validators.required],
      name: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.check_auth_token();
    // this.interval = setInterval(() => {
    //   this.submitDummyvalue();
    // }, 3000)
  }

  check_auth_token() {
    var access = sessionStorage.getItem('access');
    var email = sessionStorage.getItem('email');
    // this.session_id = sessionStorage.getItem('session_id');
    this.email = email;
    // console.log(access)
    if (!access || !email) {
      this.router.navigate(['/']);
    }
  }




  get validation_function() {
    return this.description_form.controls;
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

  onsubmit({ valid, value }) {
    this.submitted = true;
    if (this.description_form.invalid) {
      return;
    } else {
      this.loading = true;
      // console.log("value : " + JSON.stringify(value, null, 2));
      const formdata = new FormData();
      if (this.imagesToUpload) {
        for (let i = 0; i < this.imagesToUpload.length; i++) { formdata.append("files", this.imagesToUpload[i], this.imagesToUpload[i]["name"]); }
      } else {
        formdata.append("files", "");
      }
      formdata.append('session_id', this.session_id);
      formdata.append('description', value.description);
      formdata.append('name', value.name);
      formdata.append('email', this.email);
      this.apiservice.add_story(formdata).subscribe(api_response => {
        if (api_response.status) {
          // console.log("Success"+JSON.stringify(api_response,null,2));
          this.description_form.reset();
          this.image_show = false;
          this.show_alert_success = true;
          this.success_message = api_response.success;

          this.loading = false;
          $('#confirmation_modal').modal('show');
          setTimeout(() => {
            this.show_alert_success = false;
            // this.router.navigate(['/thankyou']);

          }, 2000);
          // this.get_all_stories();

        } else {
          this.loading = false;
          this.show_alert_error = true;
          this.error_message = api_response.errors;
          setTimeout(() => {
            this.show_alert_error = false;
          }, 2000);
          // console.log("Error"+JSON.stringify(api_response,null,2))
        }
      })

      // this.router.navigate(['/thankyou']);
    }
  }

  takemeToMosaic(){
    window.location.href = "/mosaic"
  }



  // submitDummyvalue() {
  //   this.counter++
  //   // console.log(this.counter)
  //   if (this.counter < 31) {
  //     //  console.log(sessionStorage.getItem('session_id'));
  //     var body = {
  //       session_id: this.session_id,
  //       files: "",
  //       email: this.email,
  //       name: $('#name').val(),
  //       description: $('#description').val(),
  //     }
  //     console.log(JSON.stringify(body, null, 2));

  //     this.apiservice.add_story_temp(body).subscribe(api_response => {
  //       console.log("api_response : " + JSON.stringify(api_response, null, 2))
  //     })
  //   } else {
  //     clearInterval(this.interval);
  //   }
  // }


  ngOnDestroy() {
    // clearInterval(this.interval)

  }


}