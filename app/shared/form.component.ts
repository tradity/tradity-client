import { Component, OnInit } from '@angular/core';

@Component({
  selector: '[tradity-form]',
  styles: [`
    :host {
      display: inline-flex;
      flex-wrap: wrap;
    }
  `],
  template: '<ng-content></ng-content>'
})
export class FormComponent { }