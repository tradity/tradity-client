import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AdminService } from '../admin.service';
import { GroupService } from '../group.service';

@Component({
  moduleId: module.id,
  selector: 'tradity-admin-groups',
  templateUrl: 'admin-groups.component.html',
  styles: ['table, th, td { border: 1px solid black; }']
})
export class AdminGroupsComponent implements OnInit {
  name: string;
  path: string;
  groups: Observable<any>;

  constructor(private adminService: AdminService, private groupService: GroupService) { }

  ngOnInit() {
    this.groups = this.groupService.groupList.map(res => res.sort((a, b) => {
      let pathA = a.path.toLowerCase();
      let pathB = b.path.toLowerCase();
      if (pathA < pathB) return -1;
      if (pathA > pathB) return 1;
      return 0;
    }))
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