import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from "@angular/http";
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

var apis = {
  registration: environment.host + "users/registration",
  // resend_email_verification_token: environment.host + "users/resend_email_verification_token",
  // emai_verify: environment.host + "users/email_verify",
  // login: environment.host + "users/login",
  // social_login: environment.host + "users/social_login",


  add_story: environment.host + "stories/add_story",
  add_story_V2: environment.host + "stories/add_story_V2",
  get_all_stories: environment.host + "stories/get_all_stories",

  //campaign 2 (financially free)
  add_answer: environment.host + "campaign_three/add_answer",
  get_all_answers: environment.host + "campaign_three/get_all_answers",

  // //temp
  // registration_temp: environment.host + "users/registration_temp",
  // add_story_temp: environment.host + "stories/add_story_temp",

  //admin
  admin_login: environment.host + "platform/login",
  get_campaign_one_users: environment.host + "platform/get_campaign_one_users",
  get_campaign_one_users_with_stories: environment.host + "platform/get_campaign_one_users_with_stories",
  get_campaign_one_users_without_stories: environment.host + "platform/get_campaign_one_users_without_stories",
  get_campaign_one_stories: environment.host + "platform/get_campaign_one_stories",
  get_campaign_one_stories_by_email: environment.host + "platform/get_campaign_one_stories_by_email",
  toggle_campaign_one_story_status: environment.host + "platform/toggle_campaign_one_story_status",
  get_campaign_three_answers: environment.host + "platform/get_campaign_three_answers",
  toggle_campaign_three_answer_status: environment.host + "platform/toggle_campaign_three_answer_status",
  
  
};

@Injectable({
  providedIn: 'root'
})

export class ApisService {

  constructor(private http: Http) { }

  registration(body) {
    return this.http.post(apis.registration, body).pipe(map((res) => res.json()));
  }

  // resend_email_verification_token(body) {
  //   return this.http.post(apis.resend_email_verification_token, body).pipe(map((res) => res.json()));
  // }

  // emai_verify(body){
  //   return this.http.post(apis.emai_verify, body).pipe(map((res) => res.json()));
  // }

  // login(body){
  //   return this.http.post(apis.login, body).pipe(map((res) => res.json()));
  // }

  // social_login(body){
  //   return this.http.post(apis.social_login, body).pipe(map((res) => res.json()));
  // }

  add_story(body) {
    var headers = this.get_auth_token();
    headers.headers.delete('Content-Type');
    return this.http.post(apis.add_story, body, headers).pipe(map((res) => res.json()));
  }

  add_story_V2(body) {
    var headers = this.get_auth_token();
    headers.headers.delete('Content-Type');
    return this.http.post(apis.add_story_V2, body, headers).pipe(map((res) => res.json()));
  }

  get_all_stories(body) {
    return this.http.post(apis.get_all_stories, body).pipe(map((res) => res.json()));
  }


  // //temp
  // registration_temp(body) {
  //   return this.http.post(apis.registration_temp, body).pipe(map((res) => res.json()));
  // }
  // add_story_temp(body) {
  //   return this.http.post(apis.add_story_temp, body).pipe(map((res) => res.json()));
  // }



   //campaign 2 (financially free)
   add_answer(body) {
    return this.http.post(apis.add_answer, body).pipe(map((res) => res.json()));
  }

  get_all_answers(body) {
    return this.http.post(apis.get_all_answers, body).pipe(map((res) => res.json()));
  }


  //admin
  admin_login(body){
    return this.http.post(apis.admin_login, body).pipe(map((res) => res.json()));
  }

  get_campaign_one_users(){
    var headers = this.get_admin_auth_token();
    return this.http.get(apis.get_campaign_one_users, headers).pipe(map((res) => res.json()));
  }

  get_campaign_one_users_with_stories(){
    var headers = this.get_admin_auth_token();
    return this.http.get(apis.get_campaign_one_users_with_stories, headers).pipe(map((res) => res.json()));
  }

  get_campaign_one_users_without_stories(){
    var headers = this.get_admin_auth_token();
    return this.http.get(apis.get_campaign_one_users_without_stories, headers).pipe(map((res) => res.json()));
  }

  get_campaign_one_stories() {
    var headers = this.get_admin_auth_token();
    return this.http.get(apis.get_campaign_one_stories, headers).pipe(map((res) => res.json()));
  }

  toggle_campaign_one_story_status(body){
    var headers = this.get_admin_auth_token();
    return this.http.post(apis.toggle_campaign_one_story_status,body, headers).pipe(map((res) => res.json()));
  }

  get_campaign_one_stories_by_email(body){
    var headers = this.get_admin_auth_token();
    return this.http.post(apis.get_campaign_one_stories_by_email,body, headers).pipe(map((res) => res.json()));
  }

  get_campaign_three_answers(){
    var headers = this.get_admin_auth_token();
    return this.http.get(apis.get_campaign_three_answers, headers).pipe(map((res) => res.json()));
  }

  toggle_campaign_three_answer_status(body){
    var headers = this.get_admin_auth_token();
    return this.http.post(apis.toggle_campaign_three_answer_status,body, headers).pipe(map((res) => res.json()));
  }



  get_auth_token() {
    var token = sessionStorage.getItem('auth_token');
    // console.log("auth_token : " + auth_token);
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + token);
    return { headers: headers }

  }

  get_admin_auth_token() {
    var auth_token = sessionStorage.getItem('admin_auth_token');
    // console.log("auth_token : " + auth_token);
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer ' + auth_token);
    return { headers: headers }

  }

}
