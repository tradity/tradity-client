import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { RankingService } from '../ranking.service';

@Component({
  moduleId: module.id,
  selector: 'tradity-group-ranking',
  templateUrl: 'group-ranking.component.html'
})
export class GroupRankingComponent implements OnInit {
  ranking: Observable<any>;

  constructor(private rankingService: RankingService) { }

  ngOnInit() {
    this.ranking = this.rankingService.rankingGroups;
    this.rankingService.loadGroups();
  }
}