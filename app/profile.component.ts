import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tradity-profile',
  templateUrl: 'profile.component.html'
})
export class ProfileComponent implements OnInit {
  constructor() { }

  ngOnInit() { 
    console.log("profile component");
  }

}