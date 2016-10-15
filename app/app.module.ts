import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { routing, appRoutingProviders } from './app.routing';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { GameComponent } from './game.component';
import { ProfileComponent } from './profile.component';
import { PortfolioComponent } from './portfolio.component';
import { TransactionsComponent } from './transactions.component';
import { RankingComponent } from './ranking.component';
import { SubnavComponent } from './subnav.component';

@NgModule({
    declarations: [
      AppComponent,
      LoginComponent,
      GameComponent,
      ProfileComponent,
      PortfolioComponent,
      TransactionsComponent,
      RankingComponent,
      SubnavComponent
    ],
    imports: [
      BrowserModule,
      FormsModule,
      HttpModule,
      routing
    ],
    providers: [appRoutingProviders],
    bootstrap: [AppComponent],
})
export class AppModule {}