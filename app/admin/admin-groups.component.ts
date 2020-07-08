
import {map} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AdminService } from '../core/admin.service';
import { GroupService } from '../core/group.service';

@Component({
  selector: 'tradity-admin-groups',
  templateUrl: 'admin-groups.component.html',
  styles: ['table, th, td { border: 1px solid black; }']
})
export class AdminGroupsComponent {
  name: string;
  path: string;
  groups: Observable<any>;

  constructor(private adminService: AdminService, private groupService: GroupService) {
    this.groups = this.groupService.groupList.pipe(map(res => res.sort((a, b) => {
      let pathA = a.path.toLowerCase();
      let pathB = b.path.toLowerCase();
      if (pathA < pathB) return -1;
      if (pathA > pathB) return 1;
      return 0;
    })));
  }

  deleteGroup(school: any) {
    if (!confirm('Wirklich Schule ' + school.schoolid + ' („' + school.name + '“) löschen?')) return;
    this.adminService.deleteGroup(school.schoolid)
    .subscribe(
      res => {
        alert('Gruppe erfolgreich gelöscht!');
        this.groupService.loadGroups();
      },
      err => alert('Fehler beim Löschen der Gruppe')
    );
  }

  createGroup() {
    this.adminService.createSchool(this.name, this.path)
    .subscribe(
      res => {
        alert('Gruppe erfolgreich erstellt!');
        this.groupService.loadGroups();
      },
      err => alert('Fehler beim Erstellen der Gruppe')
    );
  }
}