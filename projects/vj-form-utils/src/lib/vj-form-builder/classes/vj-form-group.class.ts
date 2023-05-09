import { AbstractControl, FormArray, FormGroup } from "@angular/forms";
import { VjDecoratorResult } from "./vj-decorator-result.class";

export const SUFIX_REFLECT_METADATA_KEY = 'vj:formgroup';

export abstract class VjFormGroup<T extends { [key: string]: any }> {

  [key: string]: any;

  /**
   * Set the default value to each object property.
   */
  protected abstract initFormProps(): T;

  /**
   * Restore the `AbstractControl` instance.
   * @param propertyName the property key name.
   * @returns `VjDecoratorResult<T>`.
   */
  private getDecorators<T extends AbstractControl>(propertyName: string): VjDecoratorResult<T> {
    const control = Reflect.getMetadata(`${SUFIX_REFLECT_METADATA_KEY}:${propertyName}`, this, propertyName) as T;
    return { controlName: propertyName, control };
  }

  /**
   * Factor the `FormGroup`.
   * @returns
   */
  formFactor(): FormGroup {
    const formGroup = new FormGroup({});
    const instance = this.initFormProps();
    Object.keys(instance).forEach(x => {
      const result = this.getDecorators(x);
      if (result?.controlName && result?.control) {
        const defaultValue = ((result?.control instanceof FormArray) ? (instance[x] ?? []) : (instance[x] ?? null));
        result.control.setValue(defaultValue)
        formGroup.addControl(result.controlName, result.control)
      }
    });
    return formGroup;
  }

}
