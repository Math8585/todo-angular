import { Component } from '@angular/core';
import { CategoryFormComponent } from './category-form/category-form.component';
import { CategoryListComponent } from './category/category-list.component';
import { CategoryService } from '../../../../services/category.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../../../../services/message.service';
import { Category } from '../../../../types/interfaces';
import { CommonModule } from '@angular/common';
import { TodosService } from '../../../../services/todos.servise';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CategoryFormComponent, CategoryListComponent, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  categories$ = this.categoryService.categories$;
  todosLength: number = 0;

  constructor(
    private categoryService: CategoryService,
    private messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.categoryService.loadCategories().subscribe({
      error: () => this.messageService.showMessage('Unable to load categories'),
    });
  }
  trackById = (i: number, category: Category) => category.id;

  addCategory(newName: string) {
    this.categoryService.createCategory(newName).subscribe({
      error: () => this.messageService.showMessage('Unable to add a category'),
    });
  }

  renameCategory(category: Category, name: string) {
    this.categoryService.updateCategory({ ...category, name }).subscribe({
      error: () =>
        this.messageService.showMessage('Unable to rename a category'),
    });
  }
}
