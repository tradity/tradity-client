
import {switchMap} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable ,  Subscription } from 'rxjs';

import { GroupService } from '../core/group.service';
import { AppComponent } from '../app.component';

@Component({
  moduleId: module.id,
  selector: 'tradity-group',
  templateUrl: 'group.component.html',
  styleUrls: ['group.component.css']
})
export class GroupComponent {
  private groupSubscription: Subscription;
  group: any = {};

  constructor(private route: ActivatedRoute, private groupService: GroupService, private appComponent: AppComponent) {
    this.appComponent.heading2 = 'Group';
    this.groupSubscription = this.route.params.pipe(
      switchMap((params: Params) => this.groupService.getGroup(params['id'])))
      .subscribe(res => {
        this.group = res;
        this.appComponent.heading1 = res.name;
      });
  }
}