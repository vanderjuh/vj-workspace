import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[vjInput]'
})
export class VjInputDirective {

  @Input() type: 'text' = 'text';

  constructor(
    public element: ElementRef<HTMLInputElement>
  ) {
    this.checkElementId(element);
    this.setType(element);
  }

  private setType(element: ElementRef<HTMLInputElement>): void {
    element.nativeElement.type = this.type;
  }

  private checkElementId(element: ElementRef<HTMLInputElement>): void {
    let id = this.getNewElementId();
    let existingEl = document.getElementById(id);
    while (existingEl !== null) {
      id = this.getNewElementId();
      existingEl = document.getElementById(id);
    }
    element.nativeElement.id = (element.nativeElement?.id?.length ? element.nativeElement.id : id);
  }

  private getNewElementId(): string {
    return `vj-input-${Math.random()}`;
  }
}
