import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, Validators, AbstractControl } from '@angular/forms';

@Directive({
  selector: 'input[min]',
  providers: [{provide: NG_VALIDATORS, useExisting: MinValidator, multi: true}]
})
export class MinValidator implements Validator {
  @Input() min:number;
  validate(control: AbstractControl): {[key: string]: any} {
    if(typeof this.min == 'string') this.min = +this.min;
    return this.min ? Validators.min(this.min)(control) : null;
  }
}