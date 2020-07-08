import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AdminService } from '../core/admin.service';

@Component({
  selector: 'tradity-admin-userlist',
  templateUrl: 'admin-userlist.component.html',
  styles: ['table, th, td { border: 1px solid black; }']
})
export class AdminUserlistComponent {
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

  searchText = '';

  userlist: Observable<any>;

  constructor(private adminService: AdminService) {
    this.userlist = this.adminService.userlist;
  }
}