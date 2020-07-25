import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonComponent } from './button.component';
import { SubnavComponent } from './subnav.component';
import { ContainerComponent } from './container.component';
import { ContainerControlComponent } from './container-control.component';
import { ListItemComponent } from './list-item.component';
import { ListItemHeaderComponent } from './list-item-header.component';
import { ListItemIndexComponent } from './list-item-index.component';
import { ListItemImageComponent } from './list-item-image.component';
import { ListItemValueListComponent } from './list-item-value-list.component';
import { ListItemValueItemComponent } from './list-item-value-item.component';
import { ListItemActionListComponent } from './list-item-action-list.component';
import { ValueListComponent } from './value-list.component';
import { ValueListItemComponent } from './value-list-item.component';
import { FavouriteActionComponent } from './favourite-action.component';
import { StockInfoActionComponent } from './stock-info-action.component';
import { BuyActionComponent } from './buy-action.component';
import { SellActionComponent } from './sell-action.component';
import { ListItemExpandActionComponent } from './list-item-expand-action.component';
import { IconComponent } from './icon.component';
import { NotificationComponent } from './notification.component';
//import { ChartComponent } from './chart.component';
import './checkbox';
import './input';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    ButtonComponent,
    SubnavComponent,
    ContainerComponent,
    ListItemComponent,
    ListItemHeaderComponent,
    ListItemIndexComponent,
    ListItemImageComponent,
    ListItemValueListComponent,
    ListItemValueItemComponent,
    ListItemActionListComponent,
    ValueListComponent,
    ValueListItemComponent,
    FavouriteActionComponent,
    StockInfoActionComponent,
    BuyActionComponent,
    SellActionComponent,
    ListItemExpandActionComponent,
    IconComponent,
    NotificationComponent
    /*ChartComponent*/
  ],
  declarations: [
    ButtonComponent,
    SubnavComponent,
    ContainerComponent,
    ContainerControlComponent,
    ListItemComponent,
    ListItemHeaderComponent,
    ListItemIndexComponent,
    ListItemImageComponent,
    ListItemValueListComponent,
    ListItemValueItemComponent,
    ListItemActionListComponent,
    ValueListComponent,
    ValueListItemComponent,
    FavouriteActionComponent,
    StockInfoActionComponent,
    BuyActionComponent,
    SellActionComponent,
    ListItemExpandActionComponent,
    IconComponent,
    NotificationComponent
    /*ChartComponent*/
  ],
  providers: [],
})
export class SharedModule { }
