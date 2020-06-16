import { Component, OnInit } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-winners-lists',
  templateUrl: './winners-lists.component.html',
  styleUrls: ['./winners-lists.component.css']
})
export class WinnersListsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onChange(value) {
    $('.container').css("display","none");
   $('#'+value).css("display","block");
  }

}
