import { Component, HostListener, HostBinding } from '@angular/core';

import { ContainerComponent } from './container.component';

@Component({
  moduleId: module.id,
  selector: 'tradity-container-control',
  template: '<ng-content></ng-content>',
  styleUrls: ['container-control.component.css']
})
export class ContainerControlComponent {
  @HostBinding('class.active') isActive: boolean = false;
  @HostListener('click') onClick() {
    this.isActive = this.isActive ? false : true;
    this.container.onToggle();
  }

  constructor(private container: ContainerComponent) { }
}