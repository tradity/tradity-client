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
import { ListItemActionListComponent, ListItemActionExpandDirective } from './list-item-action-list.component';

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
    ListItemValueItemComponent,
    ListItemActionListComponent,
    ListItemActionExpandDirective
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
    ListItemValueItemComponent,
    ListItemActionListComponent,
    ListItemActionExpandDirective
  ],
  providers: [],
})
export class SharedModule { }
