import { NgModule } from '@angular/core';

import { routing } from './game.routing';
import { GameComponent } from './game.component';

@NgModule({
  imports: [routing],
  exports: [],
  declarations: [GameComponent],
  providers: [],
})
export class GameModule { }
