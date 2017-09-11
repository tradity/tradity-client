import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../shared/shared.module';

import { feedReducer } from './feed.reducer';
import { FeedEffects } from './feed.effects';
import { FeedComponent } from './feed.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    StoreModule.forFeature('feed', feedReducer),
    EffectsModule.forFeature([FeedEffects])
  ],
  exports: [FeedComponent],
  declarations: [FeedComponent],
  providers: [],
})
export class FeedModule { }
