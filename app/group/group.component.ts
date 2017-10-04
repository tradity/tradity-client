import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { GroupService } from '../core/group.service';
import { AppComponent } from '../app.component';

@Component({
  moduleId: module.id,
  selector: 'tradity-group',
  templateUrl: 'group.component.html',
  styleUrls: ['group.component.css']
})
export class GroupComponent implements OnInit {
  private groupSubscription: Subscription;
  group: any = {};

  constructor(private route: ActivatedRoute, private groupService: GroupService, private appComponent: AppComponent) { }

  ngOnInit() {
    this.appComponent.heading2 = 'Group';
    this.groupSubscription = this.route.params
      .switchMap((params: Params) => this.groupService.getGroup(params['id']))
      .subscribe(res => {
        this.group = res;
        this.appComponent.heading1 = res.name;
      });
  }
}