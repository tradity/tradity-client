import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'tradity-container',
  styles: [`
    :host.active tradity-container-control {
      margin-bottom: 10px;
    }
    
    div.container-content {
      display: none;
    }
    
    :host.active div.container-content {
      display: block;
    }`],
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