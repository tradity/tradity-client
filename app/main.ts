import { bootstrap } from '@angular/platform-browser-dynamic';
import { ROUTER_PROVIDERS } from '@angular/router';
import { AppComponent } from './app.component';

bootstrap(AppComponent, [
  ROUTER_PROVIDERS
]).then(success => console.log(`Bootstrap success`))
  .catch(error => console.log(error));
