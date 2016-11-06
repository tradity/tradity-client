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
import { HistoryComponent } from './history.component';
import { RankingComponent } from './ranking.component';
import { SubnavComponent } from './subnav.component';
import { PositionsComponent } from './positions.component';
import { TableComponent } from './table.component';
import { OrdersComponent } from './orders.component';
import { FormComponent } from './form.component';

@NgModule({
    declarations: [
      AppComponent,
      LoginComponent,
      GameComponent,
      ProfileComponent,
      PortfolioComponent,
      HistoryComponent,
      RankingComponent,
      SubnavComponent,
      PositionsComponent,
      TableComponent,
      OrdersComponent,
      FormComponent
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