import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { VjInputDirective } from './directives/vj-input.directive';
import { VjMaskDirective } from './directives/vj-mask.directive';
import { VjInputComponent } from './vj-input.component';

@NgModule({
  declarations: [
    VjInputComponent,
    VjInputDirective,
    VjMaskDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    VjInputComponent,
    VjInputDirective,
    VjMaskDirective
  ]
})
export class VjInputModule { }
