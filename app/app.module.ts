import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
//import { registerLocaleData } from '@angular/common';
//import localeDe from '@angular/common/locales/de';

import { appReducer } from './app.reducer';
import { AppComponent } from './app.component';

import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { RankingModule } from './ranking/ranking.module';
import { StocksModule } from './stocks/stocks.module';
import { GroupModule } from './group/group.module';

//registerLocaleData(localeDe, 'de');

@NgModule({
    declarations: [
      AppComponent
    ],
    imports: [
      BrowserModule,
      FormsModule,
      RouterModule.forRoot([]),
      StoreModule.forRoot({ app: appReducer }),
      EffectsModule.forRoot([]),
      CoreModule,
      SharedModule,
      AuthModule/*,
      AdminModule,
      DashboardModule,
      PortfolioModule,
      RankingModule,
      StocksModule,
      GroupModule*/
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}