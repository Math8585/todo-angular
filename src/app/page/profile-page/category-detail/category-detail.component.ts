import { Component, Input, OnInit} from '@angular/core';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { TodoListComponent } from '../todo-list/todo-list.component';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { map, of, switchMap } from 'rxjs';
import { CategoryService } from '../../../../services/category.service';
import { Category, Todo } from '../../../../types/interfaces';
import { TodosService } from '../../../../services/todos.servise';
import { MessageService } from '../../../../services/message.service';
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
    private messageService: MessageService,
    private authService: AuthService
  ) {

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.resetField();
      }
    });
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        if (params.get('id')) {
          return this.categoryService.getCategoryById(+params.get('id')!);
        }
        return of(null);
      })
    ).subscribe(category => {
      if (category) {
        this.category = category;
        this.todosService.loadTodos(this.category?.id, this.todosPerPage, this.currentPage).subscribe(todoData => {
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
        this.messageService.showMessage('Todo added successfully');
        this.todosService.loadTodos(this.category?.id, this.todosPerPage, this.currentPage).subscribe({
          next: () => {
            this.messageService.showMessage('Todo list updated successfully');
          },
          error: (error) => {
            console.error('Error loading todos after adding:', error);
            this.messageService.showMessage('Unable to update todo list');
          }
        });
      },
      error: (error) => {
        console.error('Error adding todo:', error);
        this.messageService.showMessage('Unable to add a todo');
      }
    });
  }

  toggleTodo(todo: Todo) {
    this.todosService.updateTodo({ ...todo, completed: !todo.completed })
      .subscribe({
        error: () => this.messageService.showMessage('Unable to toggle a todo'),
      });
  }

  renameTodo(todo: Todo, title: string) {
    this.todosService.updateTodo({ ...todo, title })
      .subscribe({
        error: () => this.messageService.showMessage('Unable to rename a todo'),
      });
  }


  deleteTodo(todo: Todo) {
    this.todosService.deleteTodo(todo).subscribe({
      next: () => {
        this.messageService.showMessage('Todo deleted successfully');
        this.todosService.loadTodos(this.category?.id, this.todosPerPage, this.currentPage).subscribe({
          next: () => {
            this.messageService.showMessage('Todo list updated successfully');
          },
          error: (error) => {
            console.error('Error loading todos after deleting:', error);
            this.messageService.showMessage('Unable to update todo list');
          }
        });
      },
      error: (error) => {
        console.error('Error deleting todo:', error);
        this.messageService.showMessage('Unable to delete todo');
      }
    });
  }


  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Logout failed', err);
      }
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
    this.todosService.loadTodos(this.category?.id, this.todosPerPage, this.currentPage).subscribe({
      error: () => this.messageService.showMessage('Unable to load todos'),
    })
  }
}
