import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Category } from '../../../../../types/interfaces';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent {
  @Output() rename = new EventEmitter<string>();

  @Input() category!: Category;

  @ViewChild('nameField')
  set nameField(field: ElementRef) {
    if (field) {
      field.nativeElement.focus()
    }
  }

  editing = false;
  name = '';

  ngOnChanges({ category }: SimpleChanges): void {
    if (category.currentValue.title !== category.previousValue?.name) {
      this.name = category.currentValue.name;
    }
  }

  edit() {
    this.editing = true;
    this.name = this.category.name;
  }

  save() {
    if (!this.editing) {
      return;
    }

    this.editing = false;
    this.rename.emit(this.name);
  }

}



