import { VjInputErrorKeyEnum } from "../enums/vj-input-error-key.enum";

export interface IVjInputError {
  key: VjInputErrorKeyEnum;
  requiredLength: string;
  currentLength: string;
}
