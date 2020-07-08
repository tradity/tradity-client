import { Component, Input, forwardRef, HostBinding } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Store } from '@ngrx/store';

import * as appActions from '../app.actions';

const template = `
  :host {
    width: 100%;
    display: inline-flex;
    margin-bottom: 15px;
    padding: 0 12px;
    border: 1px solid #D8D8D8;
    border-radius: 3px;
    outline: none;
  }

  :host.focus,
  :host:hover {
    border-color: #F1592A;
  }

  :host.ng-touched.ng-invalid,
  :host.ng-dirty.ng-invalid {
    border-color: #D0021B;
  }

  :host.ng-touched.ng-valid,
  :host.ng-dirty.ng-valid {
    border-color: green;
  }

  span.prefix,
  span.suffix,
  input {
    display: flex;
    align-items: center;
    height: 57px;
  }

  span.prefix {
    margin-right: 7px;
  }

  span.suffix {
    margin-left: 7px;
  }

  input {
    flex: 1 1 auto;
    outline: none;
    border: none;
    font-family: inherit;
    font-size: 12px;
    line-height: 15px;
    letter-spacing: 2px;
    color: #170804;
    background-color: white;
    /*
      Hack needed to get rid of Chrome's ugly form autofill colour,
      which for some reason is an outstanding bug since 2008 -.-
      https://bugs.chromium.org/p/chromium/issues/detail?id=46543
    */
    -webkit-box-shadow: 0 0 0px 1000px white inset;
    -webkit-text-fill-color: #170804;
  }

  input:placeholder-shown { font-weight: 100; }
  input::placeholder { font-weight: 100; }
  input::-moz-placeholder { font-weight: 100; }
  input:-ms-input-placeholder { font-weight: 100; }
  input::-webkit-input-placeholder { font-weight: 100; }

  :host-context(tradity-trade) input[type=number] {
    font-size: 16px;
    font-weight: 100;
    text-align: center;
    line-height: 15px;
    letter-spacing: 2px;
    color: #170804;
  }`;

@Component({
  selector: 'tradity-input[type=text], tradity-input[type=email], tradity-input[type=password]',
  styleUrls: [template],
  template: '<span class="prefix"><tradity-icon *ngIf="prefix">{{ prefix }}</tradity-icon></span><input [type]="type" [value]="value" [placeholder]="placeholder" [autofocus]="autofocus" [disabled]="disabled" (input)="onChange($event.target.value)" (focus)="onFocus()" (blur)="onBlur()" /><span class="suffix"><tradity-icon *ngIf="prefix">{{ suffix }}</tradity-icon></span>',
  providers: [
    { 
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  @Input() value: any;
  @Input() prefix: string;
  @Input() suffix: string;
  @Input() type: string;
  @Input() placeholder: string;
  @HostBinding('class.focus') focus = false;

  private _autofocus: boolean;
  private _disabled: boolean;
  public onChange = (value: any): void => {};
  private onTouched = () => {};

  @Input()
  get autofocus(): boolean { return this._autofocus }
  set autofocus(value) { this._autofocus = value != null }

  @Input()
  get disabled(): boolean { return this._disabled }
  set disabled(isDisabled) { this._disabled = isDisabled != null }

  constructor(private store: Store<any>) { }

  onFocus() {
    this.focus = true;
    this.store.dispatch(new appActions.SetInputFocus(true));
  }

  onBlur() {
    this.focus = false;
    this.onTouched();
    this.store.dispatch(new appActions.SetInputFocus(false));
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }
}

@Component({
  selector: 'tradity-input[type=number]',
  styleUrls: [template],
  template: '<span class="prefix"></span><input type="number" [value]="value" [min]="min" [max]="max" [step]="step" [placeholder]="placeholder" [autofocus]="autofocus" [disabled]="disabled" (input)="onChange($event.target.value)" (focus)="onFocus()" (blur)="onBlur()" /><span class="suffix"></span>',
  providers: [
    { 
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputNumberComponent extends InputComponent {
  @Input() min: number;
  @Input() max: number;
  @Input() step: number;
}