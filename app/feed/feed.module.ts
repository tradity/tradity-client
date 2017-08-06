import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '../shared/shared.module';

import { feedReducer } from './feed.reducer';
import { FeedComponent } from './feed.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    StoreModule.forFeature('feed', feedReducer)
  ],
  exports: [FeedComponent],
  declarations: [FeedComponent],
  providers: [],
})
export class FeedModule { }
