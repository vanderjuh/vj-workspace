import { AfterContentInit, Component, ContentChild, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControlDirective, ValidationErrors } from '@angular/forms';
import { Router, Scroll } from '@angular/router';

import { debounceTime, filter, Subscription } from 'rxjs';

import { VjInputData } from './classes/vj-input-data.class';
import { VjInputValidator } from './classes/vj-input-validator.class';
import { VjInputDirective } from './directives/vj-input.directive';
import { VjInputErrorKeyEnum } from './enums/vj-input-error-key.enum';
import { IVjInputValidator } from './interfaces/vj-input-validator.interface';

@Component({
  selector: 'vj-input',
  templateUrl: './vj-input.component.html',
  styleUrls: ['./vj-input.component.scss']
})
export class VjInputComponent implements AfterContentInit, OnInit, OnDestroy {

  @Input() label?: string;
  @Input() hint?: string;
  @Input() list: VjInputData[] = [];
  @Input() debounceTime: number = 500;
  @Input() waiving = false;
  @Input() validator!: IVjInputValidator;
  @Input() requiredLabel = ' * ';
  @Output() selected = new EventEmitter<VjInputData>();

  @ContentChild(VjInputDirective) private _input?: VjInputDirective;
  @ContentChild(FormControlDirective) private _formControl?: FormControlDirective;

  isLoading!: boolean;
  filteredList!: VjInputData[];
  noResultsFound?: boolean;

  private searchingEvent = new EventEmitter<string>();
  private searchingSub?: Subscription;
  private routerSub?: Subscription;

  get hasAutocomplete(): boolean {
    return ((!!this.list.length) && !this.waiving);
  }

  get isFocused(): boolean {
    const el = document.activeElement;
    return ((el?.id === this._input?.element?.nativeElement?.id) && this.hasAutocomplete);
  }

  get value(): string {
    return (this._input?.element.nativeElement.value ?? '');
  }

  get invalid(): boolean {
    return (this._formControl?.invalid ?? false);
  }

  get errors(): string {
    return this.getErrorMessage(this._formControl?.errors);
  }

  private get _value(): string {
    return (this._formControl?.control.value ?? this._input?.element.nativeElement.value);
  };

  constructor(
    private router: Router
  ) {
    this.setValidator();
  }

  private setValidator() {
    this.validator = (this.validator ? this.validator : new VjInputValidator());
  }

  private getErrorMessage(errors: ValidationErrors | null | undefined): string {
    if (!errors || !Object.keys(errors)?.length) {
      return this.validator.defaultError;
    }
    const errorKeys = Object.keys(errors);
    const firstErrorKey = (errorKeys[0] as VjInputErrorKeyEnum);
    const currentLength = `${this._input?.element.nativeElement.value.length ?? 0}`;
    const requiredLength = `${errors[firstErrorKey][this.validator.ngRequiredLengthKey] ?? currentLength}`;
    return this.validator.get({ key: firstErrorKey, currentLength, requiredLength })
  }

  get isDisabled(): boolean {
    return (this._formControl?.disabled ?? this._input?.element.nativeElement.disabled ?? false);
  }

  get interacted(): boolean {
    return ((this._formControl?.dirty) ?? false);
  }

  ngOnDestroy(): void {
    this.searchingSub?.unsubscribe();
    this.routerSub?.unsubscribe();
  }

  ngOnInit(): void {
    this.filteredList = this.list;
    this.setSearchingEvent();
  }

  private setSearchingEvent() {
    if (!this.searchingSub) {
      this.searchingSub = this.searchingEvent
        .pipe(debounceTime(this.debounceTime))
        .subscribe((result) => {
          if (!this.hasAutocomplete)
            return;
          const evaluated = this.list?.filter(x => x.label.toLowerCase().trim().includes(result.toLowerCase().trim()));
          this.filteredList = (evaluated?.length) ? evaluated : this.list;
          this.noResultsFound = (evaluated?.length ? false : true);
          if (this.noResultsFound) {
            this._formControl?.control?.setErrors({ [VjInputErrorKeyEnum.noResultsFound]: true });
          } else {
            const errors = (this._formControl?.errors ?? {});
            delete errors[VjInputErrorKeyEnum.noResultsFound];
            this._formControl?.control?.setErrors(errors);
          }
          this.isLoading = false;
        });
    }
  }

  ngAfterContentInit(): void {
    this.setValue();
    this.setAutocomplete();
    this.checkDisableState(this.isDisabled);
    this.setAnchoringEvent()
  }

  onClickAutocompleteItem(event: VjInputData): void {
    if (this._input) {
      this.noResultsFound = false;
      this._formControl?.control?.setValue(event.value);
      this._input.element.nativeElement.value = ((this._input && !event.disabled) ? event.label : '');
      this.selected.emit(event);
    }
  }

  reset(): void {
    if (this._input) {
      this._formControl?.reset();
      this._input.element.nativeElement.value = '';
      this.noResultsFound = false;
    }
  }

  private checkDisableState(status?: boolean) {
    if (this._formControl || status != null) {
      if (this._input) {
        this._input.element.nativeElement.disabled = (status ?? false);
      }
    }
  }

  validate(control: AbstractControl): (ValidationErrors | null) {
    return control.validator;
  }

  private setValue(): void {
    if (this._input) {
      if (this.hasAutocomplete) {
        const associatedItem = this.list.find(x => x.value === this._value);
        this._input.element.nativeElement.value = (associatedItem ? associatedItem.label : this._value);
      } else {
        this._input.element.nativeElement.value = this._value;
      }
    }
  }

  private setAutocomplete(): void {
    if (this._input && this.hasAutocomplete) {
      this._input.element.nativeElement.addEventListener('keyup', () => {
        this.isLoading = true;
        this.noResultsFound = false;
        this.searchingEvent.emit(this.value);
      });
      this._input.element.nativeElement.addEventListener('focus', () => {
        const selectedValue = this.list.find(x => this.value.length && x.label.toLowerCase().trim().includes(this.value.toLowerCase().trim()));
        if (selectedValue) {
          this.filteredList = [selectedValue];
        }
      });
      this._input.element.nativeElement.addEventListener('focusout', () => {
        this.filteredList = this.list;
        this.markAsDirty();
      });
    }
  }

  markAsDirty(): void {
    this._formControl?.control?.markAsDirty();
  }

  focusCursor() {
    this._input?.element.nativeElement.focus();
  }

  setAnchoringEvent(): void {
    if (!this.routerSub) {
      this.routerSub = this.router.events
        .pipe(filter(x => x instanceof Scroll))
        .subscribe((event) => {
          const anchor = (event as Scroll).anchor;
          if (this._input?.element.nativeElement.id === anchor) {
            this._input?.element.nativeElement.focus();
          }
        });
    }
  }
}
