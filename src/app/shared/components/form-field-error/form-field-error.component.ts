import { Component, Input, OnInit } from '@angular/core';
import  { FormControl } from '@angular/forms';
@Component({
  selector: 'app-form-field-error',
  template: `
    <p class="text-danger">
      {{errorMessage}}
    </p>
  `,
  styleUrls: ['./form-field-error.component.scss']
})
export class FormFieldErrorComponent implements OnInit {

  @Input('form-control') formControl: FormControl;

  constructor() { }

  ngOnInit() {
  }

  public get errorMessage(): string | null {
    if(this.mustShowErrorMessage()) {
      return this.getErrorMessage();
    } else {
      return null;
    }
  }

  private mustShowErrorMessage(): boolean {
    return this.formControl.invalid && this.formControl.touched;
  }

  private getErrorMessage(): string | null {
    if (this.formControl.errors.required) {
      return 'DADO OBRIGATÓRIO';
    } else if (this.formControl.errors.minlength) {
      const requiredLength = this.formControl.errors.minlength.requiredLength;
      return `DEVE TER NO MÍNIMO ${requiredLength} CARACTERES`;
    } else if (this.formControl.errors.maxlength) {
      const requiredLength = this.formControl.errors.maxlength.requiredLength;
      return `DEVE TER NO MÁXIMO ${requiredLength} CARACTERES`;
    } else if (this.formControl.errors.email) {
      return `FORMATO DE E-MAIL INVÁLIDO`;
    }
  }

}
