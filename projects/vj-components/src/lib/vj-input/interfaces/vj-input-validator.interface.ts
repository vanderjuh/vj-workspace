import { VjInputErrorKeyEnum } from "../enums/vj-input-error-key.enum";
import { IVjInputError } from "./vj-input-error.interface";

export interface IVjInputValidator {
  [VjInputErrorKeyEnum.required]: string;
  [VjInputErrorKeyEnum.noResultsFound]: string;
  [VjInputErrorKeyEnum.defaultError]: string;
  ngRequiredLengthKey: string;
  get(data: IVjInputError): string;
}
