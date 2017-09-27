import { Component, HostBinding } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'tradity-action-favourite',
  template: '<i class="material-icons">favorite_border</i>'
})
export class FavouriteActionComponent {
  @HostBinding('attr.role') role = 'button';

  constructor() { }
}