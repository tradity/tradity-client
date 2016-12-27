import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tradity-container',
  styleUrls: ['app/shared/container.component.css'],
  template: '<div>Control Button</div><ng-content></ng-content>'
})
export class ContainerComponent implements OnInit {
  constructor() { }

  ngOnInit() { }
}