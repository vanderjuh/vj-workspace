import { AbstractControl } from '@angular/forms';

export class VjDecoratorResult<T extends AbstractControl> {
  controlName!: string;
  control!: T;
}
