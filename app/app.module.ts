import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/zip';
import 'rxjs/add/observable/throw';

import { routing, appRoutingProviders } from './app.routing';
import { AppComponent } from './app.component';

import { ApiService } from './api.service';
import { StocksService } from './stocks.service';
import { UserService } from './user.service';
import { RankingService } from './ranking.service';
import { FeedService } from './feed.service';
import { GroupService } from './group.service';
import { AdminService } from './admin.service';

import { LoginModule } from './login/login.module';
import { RegistrationModule } from './registration/registration.module';
import { GameModule } from './game/game.module';
import { AdminModule } from './admin/admin.module';

@NgModule({
    declarations: [
      AppComponent
    ],
    imports: [
      BrowserModule,
      FormsModule,
      HttpModule,
      routing,
      LoginModule,
      RegistrationModule,
      GameModule,
      AdminModule
    ],
    providers: [
      appRoutingProviders,
      ApiService,
      StocksService,
      UserService,
      RankingService,
      FeedService,
      GroupService,
      AdminService
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}