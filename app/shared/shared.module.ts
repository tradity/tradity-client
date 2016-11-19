import { NgModule } from '@angular/core';

import { FormComponent } from './form.component';
import { SubnavComponent } from './subnav.component';
import { TableComponent } from './table.component';

@NgModule({
  imports: [],
  exports: [
    FormComponent,
    SubnavComponent,
    TableComponent
  ],
  declarations: [
    FormComponent,
    SubnavComponent,
    TableComponent
  ],
  providers: [],
})
export class SharedModule { }
