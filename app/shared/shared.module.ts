import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormComponent } from './form.component';
import { ButtonComponent } from './button.component';
import { InputComponent } from './input.component';
import { SubnavComponent } from './subnav.component';
import { BottomNavComponent } from './bottom-nav.component';
import { ContainerComponent } from './container.component';
import { ContainerControlComponent } from './container-control.component';
import { ListItemComponent } from './list-item.component';
import { ListItemHeaderComponent } from './list-item-header.component';
import { ListItemIndexComponent } from './list-item-index.component';
import { ListItemImageComponent } from './list-item-image.component';
import { ListItemValueListComponent } from './list-item-value-list.component';
import { ListItemValueItemComponent } from './list-item-value-item.component';
import { ListItemActionListComponent, ListItemActionExpandDirective } from './list-item-action-list.component';
import { ValueListComponent } from './value-list.component';
import { ValueListItemComponent } from './value-list-item.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    FormComponent,
    ButtonComponent,
    InputComponent,
    SubnavComponent,
    BottomNavComponent,
    ContainerComponent,
    ListItemComponent,
    ListItemHeaderComponent,
    ListItemIndexComponent,
    ListItemImageComponent,
    ListItemValueListComponent,
    ListItemValueItemComponent,
    ListItemActionListComponent,
    ListItemActionExpandDirective,
    ValueListComponent,
    ValueListItemComponent
  ],
  declarations: [
    FormComponent,
    ButtonComponent,
    InputComponent,
    SubnavComponent,
    BottomNavComponent,
    ContainerComponent,
    ContainerControlComponent,
    ListItemComponent,
    ListItemHeaderComponent,
    ListItemIndexComponent,
    ListItemImageComponent,
    ListItemValueListComponent,
    ListItemValueItemComponent,
    ListItemActionListComponent,
    ListItemActionExpandDirective,
    ValueListComponent,
    ValueListItemComponent
  ],
  providers: [],
})
export class SharedModule { }
