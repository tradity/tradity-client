import { Injectable } from '@angular/core';

import { ApiService } from './api.service';

@Injectable()
export class RankingService {

  constructor(private apiService: ApiService) { }
  
  load() {
    this.apiService.get('/ranking')
    .map(res => res.json())
    .subscribe(res => console.log(res));
  }

}