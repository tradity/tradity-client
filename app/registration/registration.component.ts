import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'tradity-registration',
  templateUrl: 'registration.component.html',
  styleUrls: ['registration.component.css']
})
export class RegistrationComponent implements OnInit {
  username: string;
  email: string;
  password: string;
  passwordCheck: string;

  constructor() { }

  ngOnInit() { }

  register() { }
}