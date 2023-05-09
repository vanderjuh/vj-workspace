import "reflect-metadata";

import { FormArray, FormControl, ValidatorFn } from "@angular/forms";
import { SUFIX_REFLECT_METADATA_KEY, VjFormGroup } from "../classes/vj-form-group.class";

export const VjFormControl = (validatorFn?: ValidatorFn | ValidatorFn[]) => (target: VjFormGroup<any>, key: string) => {
  const value = (target[key] ?? null);
  Reflect.defineMetadata(`${SUFIX_REFLECT_METADATA_KEY}:${key}`, new FormControl(value, validatorFn), target, key);
}

export const VjFormArray = (validatorFn?: ValidatorFn | ValidatorFn[]) => (target: VjFormGroup<any>, key: string) => {
  Reflect.defineMetadata(`${SUFIX_REFLECT_METADATA_KEY}:${key}`, new FormArray([], validatorFn), target, key);
}
