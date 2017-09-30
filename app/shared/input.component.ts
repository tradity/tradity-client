import { Component, Input, forwardRef, HostBinding } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  moduleId: module.id,
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
  private onChange: (value: any) => void;
  private onTouched: () => void;

  @Input()
  get autofocus(): boolean { return this._autofocus }
  set autofocus(value) { this._autofocus = value != null }

  @Input()
  get disabled(): boolean { return this._disabled }
  set disabled(isDisabled) { this._disabled = isDisabled != null }

  onFocus() {
    this.focus = true;
  }

  onBlur() {
    this.focus = false;
    this.onTouched();
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