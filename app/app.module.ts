import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { StoreModule, ActionReducer, MetaReducer } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { localStorageSync } from 'ngrx-store-localstorage';

import { appRoutes } from './app.routing';
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

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({ keys: ['auth', 'feed', 'stocks'], rehydrate: true })(reducer);
}

const metaReducers: Array<MetaReducer<any, any>> = [localStorageSyncReducer];

@NgModule({
    declarations: [
      AppComponent
    ],
    imports: [
      BrowserModule,
      FormsModule,
      HttpModule,
      RouterModule.forRoot(appRoutes),
      StoreModule.forRoot({ app: appReducer }, { metaReducers }),
      // isDevMode ? StoreDevtoolsModule.instrument({ maxAge: 25 }) : [],
      EffectsModule.forRoot([]),
      CoreModule,
      SharedModule,
      AuthModule,
      AdminModule,
      DashboardModule,
      PortfolioModule,
      RankingModule,
      StocksModule,
      GroupModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}