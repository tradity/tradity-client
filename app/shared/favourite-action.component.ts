import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'tradity-action-favourite',
  template: '<tradity-icon>favorite_border</tradity-icon>'
})
export class FavouriteActionComponent {
  @HostBinding('attr.role') role = 'button';

  constructor() { }
}