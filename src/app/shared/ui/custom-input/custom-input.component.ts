import { Component, Input , forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor , NG_VALUE_ACCESSOR  } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-input.component.html',
  providers: [
  {
    provide: NG_VALUE_ACCESSOR,
    useExisting: CustomInputComponent,
    multi: true
  }
]
})
export class CustomInputComponent implements ControlValueAccessor {
  value: string = '';
  onChange = (value: string) => {};
  onTouched = () => {};

  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() customClass: string = '';
  @Input() hasError: boolean = false;

  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // optional for Angular forms
  }
}
