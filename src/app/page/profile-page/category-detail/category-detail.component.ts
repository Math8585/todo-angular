import { Component, Input, OnInit} from '@angular/core';
import { SearchComponent } from '../search/search.component';
import { TodoFormComponent } from '../todo-form/todo-form.component';
import { TodoListComponent } from '../todo-list/todo-list.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { CategoryService } from '../../../../services/category.service';
import { Category, Todo } from '../../../../types/interfaces';
import { TodosService } from '../../../../services/todos.servise';
import { MessageService } from '../../../../services/message.service';
import { AuthService } from '../../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [SearchComponent, TodoFormComponent, TodoListComponent, CommonModule],
  templateUrl: './category-detail.component.html',
  styleUrl: './category-detail.component.css'
})
export class CategoryDetailComponent implements OnInit{

  todos$ = this.todosService.todos$;

  category: Category | null = null;

  constructor(private route: ActivatedRoute,
    private categoryService: CategoryService,
    private router: Router,
    private todosService: TodosService,
    private messageService: MessageService,
    private authService: AuthService
  ) { }

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
        this.todosService.loadTodos(this.category?.id).subscribe({
          error: () => this.messageService.showMessage('Unable to load todos'),
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

  addTodo(newTitle: string,) {
    this.todosService.createTodo(newTitle, this.category?.id!)
      .subscribe({
        error: () => this.messageService.showMessage('Unable to add a todo'),
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
    this.todosService.deleteTodo(todo)
      .subscribe({
        error: () => this.messageService.showMessage('Unable to delete a todo'),
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
}


