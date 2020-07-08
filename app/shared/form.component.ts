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
    
    :host >>> input[type=checkbox] {
      position: absolute;
      left: -10000px;
    }
    
    :host >>> input[type=checkbox] + label {
      display: inline-flex;
      align-items: center;
      font-size: 12px;
      line-height: 24px;
      margin-bottom: 15px;
    }
    
    :host >>> input[type=checkbox] + label::before {
      content: "check_box_outline_blank";
      font-family: "Material Icons";
      font-size: 32px;
      color: #D8D8D8;
      margin: 0 6px 0 -3px;
    }
    
    :host >>> input[type=checkbox]:focus + label::before,
    :host >>> input[type=checkbox]:hover + label::before {
      color: #F1592A;
    }
    
    :host >>> input[type=checkbox]:checked + label::before {
      content: "check_box";
      color: #F1592A;
    }
    
    :host >>> input[type=radio] {
      position: absolute;
      left: -10000px;
    }
    
    :host >>> input[type=radio] + label {
      font-size: 30px;
      font-weight: 900;
      line-height: 36px;
      color: #FFFFFF;
      text-transform: uppercase;
      background-color: rgba(23,8,4,0.2);
      display: inline-flex;
      flex-basis: 50%;
      padding: 26px 0;
      justify-content: center;
      margin-bottom: 30px;
    }
    
    :host >>> input[type=radio] + label:first-of-type {
      border-right: 1px solid white;
      flex-basis: calc(50% - 1px);
    }
    
    :host >>> input[type=radio]:checked + label {
      background-color: rgba(40,59,144,0.95);
    }`],
  template: '<ng-content></ng-content>'
})
export class FormComponent { }