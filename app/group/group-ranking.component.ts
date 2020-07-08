import { Component, OnInit } from '@angular/core';

import { GroupComponent } from './group.component';

@Component({
  selector: 'tradity-group-ranking',
  templateUrl: 'group-ranking.component.html'
})
export class GroupRankingComponent {
  constructor(public parent: GroupComponent) { }
}