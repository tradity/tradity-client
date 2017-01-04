import { NgModule } from '@angular/core';

import { FormComponent } from './form.component';
import { SubnavComponent } from './subnav.component';
import { TableComponent } from './table.component';
import { BottomNavComponent } from './bottom-nav.component';
import { ContainerComponent } from './container.component';
import { ContainerControlComponent } from './container-control.component';
import { ListItemComponent } from './list-item.component';
import { ListItemHeaderComponent } from './list-item-header.component';
import { ListItemValueListComponent } from './list-item-value-list.component';
import { ListItemValueItemComponent } from './list-item-value-item.component';

@NgModule({
  imports: [],
  exports: [
    FormComponent,
    SubnavComponent,
    TableComponent,
    BottomNavComponent,
    ContainerComponent,
    ContainerControlComponent,
    ListItemComponent,
    ListItemHeaderComponent,
    ListItemValueListComponent,
    ListItemValueItemComponent
  ],
  declarations: [
    FormComponent,
    SubnavComponent,
    TableComponent,
    BottomNavComponent,
    ContainerComponent,
    ContainerControlComponent,
    ListItemComponent,
    ListItemHeaderComponent,
    ListItemValueListComponent,
    ListItemValueItemComponent
  ],
  providers: [],
})
export class SharedModule { }
