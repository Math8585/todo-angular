import { Component } from '@angular/core';
import { CategoryFormComponent } from './category-form/category-form.component';
import { CategoryListComponent } from './category/category-list.component';
import { CategoryService } from '../../../../services/category.service';
import { RouterLink } from '@angular/router';
import { Category } from '../../../../types/interfaces';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CategoryFormComponent, CategoryListComponent, CommonModule, RouterLink],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  categories$ = this.categoryService.categories$;
  todosLength: number = 0;

  constructor(
    private categoryService: CategoryService,
  ) {}

  ngOnInit(): void {
    this.categoryService.loadCategories().subscribe();
  }
  trackById = (i: number, category: Category) => category.id;

  addCategory(newName: string) {
    this.categoryService.createCategory(newName).subscribe();
  }

  renameCategory(category: Category, name: string) {
    this.categoryService.updateCategory({ ...category, name }).subscribe();
  }
}
