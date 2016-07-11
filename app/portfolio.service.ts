import { Injectable } from '@angular/core';

import { ApiService } from './api.service';

@Injectable()
export class PortfolioService {
  
  private _portfolio;

  constructor(private apiService: ApiService) { }
  
  get portfolio() {
    return this._portfolio.asObservable();
  }
  
  load(): void {
    this.apiService.get('/depot')
    .map(res => res.json())
    .subscribe(res => console.log(res));
  }

}