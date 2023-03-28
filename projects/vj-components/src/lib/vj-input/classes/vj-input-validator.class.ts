import { VjInputErrorKeyEnum } from "../enums/vj-input-error-key.enum";
import { IVjInputError } from "../interfaces/vj-input-error.interface";
import { IVjInputValidator } from "../interfaces/vj-input-validator.interface";

export class VjInputValidator implements IVjInputValidator {

  readonly requiredLengthKey = '{{requiredLength}}';
  readonly currentLengthKey = '{{currentLength}}';
  readonly ngRequiredLengthKey = 'requiredLength';

  [VjInputErrorKeyEnum.required]: string = 'This field is required.';
  [VjInputErrorKeyEnum.noResultsFound]: string = 'No results found.';
  [VjInputErrorKeyEnum.defaultError]: string = 'Invalid field.';
  [VjInputErrorKeyEnum.minlength] = `The minimum length is ${this.requiredLengthKey} and the actual length is ${this.currentLengthKey}.`;
  [VjInputErrorKeyEnum.maxlength] = `The maximum length is ${this.requiredLengthKey} and the actual length is ${this.currentLengthKey}.`;

  get(data: IVjInputError): string {
    const message = this[data.key];

    if (!message)
      return this.defaultError;

    return this[data.key]
      .replace(this.requiredLengthKey, `${data.requiredLength}`)
      .replace(this.currentLengthKey, `${data.currentLength}`);
  }
}
