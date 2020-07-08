import { Component, Input, forwardRef, HostBinding } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Store } from '@ngrx/store';

import * as appActions from '../app.actions';

@Component({
  selector: 'tradity-input[type=text], tradity-input[type=email], tradity-input[type=password]',
  styleUrls: ['input.component.css'],
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
  styleUrls: ['input.component.css'],
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