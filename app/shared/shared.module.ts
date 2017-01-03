import { NgModule } from '@angular/core';

import { FormComponent } from './form.component';
import { SubnavComponent } from './subnav.component';
import { TableComponent } from './table.component';
import { BottomNavComponent } from './bottom-nav.component';
import { ContainerComponent } from './container.component';
import { ContainerControlComponent } from './container-control.component';

@NgModule({
  imports: [],
  exports: [
    FormComponent,
    SubnavComponent,
    TableComponent,
    BottomNavComponent,
    ContainerComponent,
    ContainerControlComponent
  ],
  declarations: [
    FormComponent,
    SubnavComponent,
    TableComponent,
    BottomNavComponent,
    ContainerComponent,
    ContainerControlComponent
  ],
  providers: [],
})
export class SharedModule { }
