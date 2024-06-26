import { Component, ElementRef, EventEmitter, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Category } from '../../../../../types/interfaces';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TodosService } from '../../../../../services/todos.servise';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './category-list.component.html',
})
export class CategoryListComponent {
  @Output() rename = new EventEmitter<string>();

  @Input() category!: Category;

  constructor(private todosService: TodosService) {

  }

  @ViewChild('nameField')
  set nameField(field: ElementRef) {
    if (field) {
      field.nativeElement.focus()
    }
  }

  editing = false;
  todos$ = this.todosService.todos$;
  name = '';

  ngOnChanges({ category }: SimpleChanges): void {
    if (category.currentValue.name !== category.previousValue?.name) {
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



