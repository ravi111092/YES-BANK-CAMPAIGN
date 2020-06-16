import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;
@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent implements OnInit {

  constructor(private router : Router) { }

  ngOnInit() {

    $("#accordion > .opener .anchor").click(function () {
      if (
        false ==
        $(this)
          .next()
          .is(":visible")
      ) {
        $("#accordion .child_menu").slideUp(300);
      }
      $(this)
        .next()
        .slideToggle(300);
    });

    $('#accordion .opener .child_menu:eq(0)').show();

    // if ($(window).width() > 1200) {
    //   $("#toggle").click(function () {
    //     $("#toggle").toggleClass("togglemargin");
    //     $(".left_col.scroll-view").toggleClass("nav-sm");
    //     $(".routerWrapper").toggleClass("marginAdjust");
    //     $(".site_title").toggle();
    //     $(".site_title_icon").toggle();
    //   });
    // }

    // if ($(window).width() < 1200) {
    //   $("#toggle").click(function () {
    //     // console.log("hello");
    //     // $("#toggle").css("margin-left","250px !important");
    //     $(".left_col.scroll-view").toggle("fast");
    //     $(".left_col.scroll-view").addClass("slideInLeft");
    //     $(".left_col.scroll-view").removeClass("slideOutLeft");
    //     $("#toggle").toggleClass("moveRight");
    //     // $("#toggle").css("margin-left","0px !important");
    //   });

    //   $(".closeButton").click(function () {
    //     $(".left_col.scroll-view").toggle();
    //     $(".left_col.scroll-view").addClass("slideOutLeft");
    //     $(".left_col.scroll-view").removeClass("slideInLeft");
    //   });

    //   // $('.linking').click(function () {
    //   //   $(".closeButton").click();
    //   // });
    // }


  }

  logout(){
    sessionStorage.clear();
    this.router.navigate(['/admin'])
  }

}
