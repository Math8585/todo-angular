import { BehaviorSubject, tap, withLatestFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Todo } from '../types/interfaces';
@Injectable({
  providedIn: 'root'
})
export class TodosService {
  private API_URL = 'https://todo-app-scp7.onrender.com'
  private todos$$ = new BehaviorSubject <{ todos: Todo[], total: number
} >({ todos: [], total: 0 });

  todos$ = this.todos$$.asObservable();

  constructor(
    private http: HttpClient,
  ) { }

  loadTodos(categoryId?: string, todosPerPage?: number, currentPage?: number) {
    const queryParams = `?pagesize=${todosPerPage}&page=${currentPage}`;
    return this.http.get<{ todos: Todo[], total: number }>(`${this.API_URL}/api/todos/${categoryId}${queryParams}`)
      .pipe(
        tap(({ todos, total }) => {
          this.todos$$.next({ todos, total });
        }),
      );
  }

  createTodo(title: string, categoryId: string) {
    return this.http.post<Todo>(`${this.API_URL}/api/todos`, {
      title,
      completed: false,
      categoryId
    })
      .pipe(
        withLatestFrom(this.todos$$),
        tap(([createdTodo, todos]) => {
          this.todos$$.next({
            todos: [...todos.todos, createdTodo],
            total: todos.total
          }
          );
        }),
    )
  }

  updateTodo({ id, ...data }: Todo) {
    return this.http.put<Todo>(`${this.API_URL}/api/todos/${id}`, data)
      .pipe(
        withLatestFrom(this.todos$$),
        tap(([updatedTodo, { todos, total }]) => {
          const updatedTodos = todos.map(todo => todo.id === id ? updatedTodo : todo);
          this.todos$$.next({ todos: updatedTodos, total });
        }),
      );
  }

  deleteTodo({ id }: Todo) {
    return this.http.delete<Todo>(`${this.API_URL}/api/todos/${id}`)
      .pipe(
        withLatestFrom(this.todos$$),
        tap(([_, { todos, total }]) => {
          const updatedTodos = todos.filter(todo => todo.id !== id);
          this.todos$$.next({ todos: updatedTodos, total: total - 1 });
        }),
      );
  }
}
