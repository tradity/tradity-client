import { Component, HostListener, HostBinding, Output, EventEmitter } from '@angular/core';

import { ContainerComponent } from './container.component';

@Component({
  selector: 'tradity-container-control',
  template: '<ng-content></ng-content>',
  styleUrls: ['app/shared/container-control.component.css']
})
export class ContainerControlComponent {
  @Output() onToggle = new EventEmitter();
  @HostBinding('class.active') isActive: boolean = false;
  @HostListener('click') onClick() {
    this.isActive = this.isActive ? false : true;
    this.onToggle.emit();
    this.container.onToggle();
  }

  constructor(private container: ContainerComponent) { }
}