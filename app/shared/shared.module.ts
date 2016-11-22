import { NgModule } from '@angular/core';

import { FormComponent } from './form.component';
import { SubnavComponent } from './subnav.component';
import { TableComponent } from './table.component';
import { BottomNavComponent } from './bottom-nav.component';

@NgModule({
  imports: [],
  exports: [
    FormComponent,
    SubnavComponent,
    TableComponent,
    BottomNavComponent
  ],
  declarations: [
    FormComponent,
    SubnavComponent,
    TableComponent,
    BottomNavComponent
  ],
  providers: [],
})
export class SharedModule { }
