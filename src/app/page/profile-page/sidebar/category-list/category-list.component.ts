import { Component } from '@angular/core';
import { Category } from '../../../../../types/interfaces';
import { CategoryService } from '../../../../../services/category.service';
import { of, switchMap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent {

  categories: Category[] = [];

  isNew = true;

  constructor(private categoryService: CategoryService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((categories) => {
    this.categories = categories;
    });
  }
}

