import { NgModule } from '@angular/core';

import { FormComponent } from './form.component';
import { SubnavComponent } from './subnav.component';
import { TableComponent } from './table.component';
import { BottomNavComponent } from './bottom-nav.component';
import { ContainerComponent } from './container.component';

@NgModule({
  imports: [],
  exports: [
    FormComponent,
    SubnavComponent,
    TableComponent,
    BottomNavComponent,
    ContainerComponent
  ],
  declarations: [
    FormComponent,
    SubnavComponent,
    TableComponent,
    BottomNavComponent,
    ContainerComponent
  ],
  providers: [],
})
export class SharedModule { }
