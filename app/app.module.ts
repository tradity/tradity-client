import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { routing, appRoutingProviders } from './app.routing';
import { AppComponent } from './app.component';
import { PortfolioModule } from './portfolio/portfolio.module';

import { ApiService } from './api.service';
import { StocksService } from './stocks.service';
import { LoginComponent } from './login/login.component';
import { GameComponent } from './game.component';
import { ProfileComponent } from './profile.component';
import { RankingComponent } from './ranking.component';
import { SubnavComponent } from './subnav.component';
import { TableComponent } from './table.component';
import { FormComponent } from './form.component';

@NgModule({
    declarations: [
      AppComponent,
      LoginComponent,
      GameComponent,
      ProfileComponent,
      RankingComponent,
      SubnavComponent,
      TableComponent,
      FormComponent
    ],
    imports: [
      BrowserModule,
      FormsModule,
      HttpModule,
      routing,
      PortfolioModule
    ],
    providers: [
      appRoutingProviders,
      ApiService,
      StocksService
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}