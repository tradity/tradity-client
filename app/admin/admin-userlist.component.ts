import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AdminService } from '../admin.service';

@Component({
  moduleId: module.id,
  selector: 'tradity-admin-userlist',
  templateUrl: 'admin-userlist.component.html',
  styles: ['table, th, td { border: 1px solid black; }']
})
export class AdminUserlistComponent implements OnInit {
  reverse = true;
  showImpersonate = true;
  showID = true;
  showName = true;
  showFullName = true;
  showEMail = true;
  showLastLogin = false;
  showRegisterTime = true;
  showTrades = false;
  showComments = false;
  showLastComment = false;
  showBirthday = false;
  showSchool = true;
  showAddress = false;
  showProvision = false;
  showDeletion = false;
  showFreemoney = false;
  showTotalvalue = false;
  showRecvProvision = false;
  showDeleteUser = true;

  userlist: Observable<any>;

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.userlist = this.adminService.userlist;
  }
}