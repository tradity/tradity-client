import { Component, OnInit } from '@angular/core';

@Component({
  selector: '[tradity-form]',
  styles: [`
    :host {
      display: inline-flex;
      flex-wrap: wrap;
    }
    
    :host >>> select {
      margin-bottom: 15px;
      border: 1px solid #D8D8D8;
      border-radius: 3px;
      outline: none;
      width: 100%;
      padding: 20px;
      font-family: inherit;
      font-size: 12px;
      line-height: 15px;
      letter-spacing: 2px;
      color: #170804;
      background-color: white;
    }
    
    /*
      Hack needed to get rid of Chrome's ugly form autofill colour,
      which for some reason is an outstanding bug since 2008 -.-
      https://bugs.chromium.org/p/chromium/issues/detail?id=46543
    */
    :host >>> select:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px white inset;
        -webkit-text-fill-color: #170804;
    }
  `],
  template: '<ng-content></ng-content>'
})
export class FormComponent { }