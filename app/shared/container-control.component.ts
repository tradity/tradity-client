import { Component, HostListener, HostBinding } from '@angular/core';

import { ContainerComponent } from './container.component';

@Component({
  selector: 'tradity-container-control',
  template: '<ng-content></ng-content>',
  styles: [`
    :host {
      display: flex;
      justify-content: space-between;
      border: 1px solid #170804;
      border-radius: 40px;
      padding: 12px;
      font-size: 12px;
      font-weight: bold;
      line-height: 15px;
      color: #170804;
    }
    
    :host.active,
    :host:hover {
      border-color: #F1592A;
    }
    
    :host::after {
      font-family: "Material Icons";
      font-size: 24px;
      content: "expand_more";
    }
    
    :host.active::after {
      content: "expand_less";
    }`]
})
export class ContainerControlComponent {
  @HostBinding('class.active') isActive: boolean = false;
  @HostListener('click') onClick() {
    this.isActive = this.isActive ? false : true;
    this.container.onToggle();
  }

  constructor(private container: ContainerComponent) { }
}