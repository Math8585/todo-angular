import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './category-form.component.html',
})
export class CategoryFormComponent {
  @Output() save = new EventEmitter<string>();

  protected  categoryForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
      ],
    }),
  });

  get name() {
    return this.categoryForm.get('name') as FormControl;
  }

  handleFormSubmit() {
    if (this.categoryForm.invalid) {
      return;
    }

    this.save.emit(this.name.value);
    this.categoryForm.reset();
  }
}
