import { Component, OnInit} from '@angular/core';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { TodoListComponent } from '../todo-list/todo-list.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { map, of, switchMap } from 'rxjs';
import { CategoryService } from '../../../../services/category.service';
import { Category, Todo } from '../../../../types/interfaces';
import { TodosService } from '../../../../services/todos.servise';
import { AuthService } from '../../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';


@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [TodoFormComponent, TodoListComponent, CommonModule, FormsModule, MatPaginatorModule],
  templateUrl: './category-detail.component.html',
  styleUrl: './category-detail.component.css'
})
export class CategoryDetailComponent implements OnInit {
  todos$ = this.todosService.todos$;
  category: Category | null = null;
  totalTodos: number = 0;
  todosPerPage: number = 5;
  search: any;
  currentPage: number = 1;

  constructor(private route: ActivatedRoute,
    private categoryService: CategoryService,
    private router: Router,
    private todosService: TodosService,
    private authService: AuthService
  ) {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.resetField();
      }
    });
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');
          if (id) {
            return this.categoryService.getCategoryById(+id);
          }
          return of(null);
        })
      )
      .subscribe();

    this.categoryService.category$.subscribe((category) => {
      this.category = category;
      if (category) {
        this.todosService
          .loadTodos(category.id, this.todosPerPage, this.currentPage)
          .subscribe((todoData) => {
            this.totalTodos = todoData.total;
          });
      }
    });
  }

  deleteCategory() {
    const decision = window.confirm('Are you sure?');

    if (decision) {
      this.categoryService.deleteCategory(this.category!).subscribe(
        () => this.router.navigate(['/profile'])
      );
    }
  }

  trackById = (i: number, todo: Todo) => todo.id;

  addTodo(newTitle: string) {
    this.todosService.createTodo(newTitle, this.category?.id!).subscribe({
      next: () => {
        this.todosService.loadTodos(this.category?.id, this.todosPerPage, this.currentPage).subscribe({
        });
      },
    });
  }


  toggleTodo(todo: Todo) {
    this.todosService.updateTodo({ ...todo, completed: !todo.completed })
      .subscribe();
  }

  renameTodo(todo: Todo, title: string) {
    this.todosService.updateTodo({ ...todo, title })
      .subscribe();
  }


  deleteTodo(todo: Todo) {
    this.todosService.deleteTodo(todo).subscribe({
      next: () => {
        this.todosService.loadTodos(this.category?.id, this.todosPerPage, this.currentPage).subscribe();
      }
    });
  }


  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
    });

  }
  Search() {
    if (this.search === '') {
      this.todos$ = this.todosService.todos$.pipe(
        map(({ todos, total }) => ({ todos, total }))
      );
    } else {

      this.todos$ = this.todosService.todos$.pipe(
        map(({ todos }) => ({
          todos: todos.filter(todo =>
            todo.title.toLowerCase().includes(this.search.toLowerCase())
          ),
          total: todos.length
        }))
      );
    }
  }

  resetField(): void {
    this.search = '';
  }

  onPageChange(pageDate: PageEvent): void {
    this.currentPage = pageDate.pageIndex + 1;
    this.todosPerPage = pageDate.pageSize
    this.todosService.loadTodos(this.category?.id, this.todosPerPage, this.currentPage).subscribe()
  }
}
