import { Component, HostBinding, Input } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'tradity-container',
  styleUrls: ['container.component.css'],
  template: `
    <tradity-container-control>{{ name }}</tradity-container-control>
    <div class="container-content">
      <ng-content></ng-content>
    </div>
  `
})
export class ContainerComponent {
  @Input() name: string;
  @HostBinding('class.active') isActive = false;

  constructor() { }

  onToggle() {
    this.isActive = this.isActive ? false : true;
  }
}