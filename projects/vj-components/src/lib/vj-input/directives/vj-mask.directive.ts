import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[vjMask]'
})
export class VjMaskDirective {

  @Input() uppercase!: boolean;

  private value!: string;

  get fieldValue(): string {
    return this.element.nativeElement.value;
  }

  get lastChar(): string {
    return this.fieldValue.slice(-1);
  }

  get isAllValueSelected(): boolean {
    return (this.element.nativeElement.selectionStart === 0) && (this.element.nativeElement.selectionEnd === (this.fieldValue.length));
  }

  constructor(
    public element: ElementRef<HTMLInputElement>
  ) {
    element.nativeElement.addEventListener('keyup', (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.uppercaseValue();
    })
  }

  private uppercaseValue() {
    if (this.uppercase) {
      this.value = this.value?.toUpperCase();
      this.element.nativeElement.value = this.fieldValue.toUpperCase();
    }
  }

}
