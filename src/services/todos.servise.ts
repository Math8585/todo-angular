import { BehaviorSubject, tap, withLatestFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Todo } from '../types/interfaces';
@Injectable({
  providedIn: 'root'
})
export class TodosService {
  private todos$$ = new BehaviorSubject<Todo[]>([]);

  todos$ = this.todos$$.asObservable();

  constructor(
    private http: HttpClient,
  ) { }

  loadTodos(categoryId?: string) {
    return this.http.get<Todo[]>(`/api/todos/${categoryId}`)
      .pipe(
        tap(todos => {
          this.todos$$.next(todos)
        }),
      );
  }

  createTodo(title: string, categoryId: string) {
    return this.http.post<Todo>(`/api/todos`, {
      title,
      completed: false,
      categoryId
    })
      .pipe(
        withLatestFrom(this.todos$$),
        tap(([createdTodo, todos]) => {
          this.todos$$.next(
            [...todos, createdTodo]
          );
        }),
      )
  }

  updateTodo({ id, ...data }: Todo) {
    return this.http.put<Todo>(`/api/todos/${id}`, data)
      .pipe(
        withLatestFrom(this.todos$$),
        tap(([updatedTodo, todos]) => {
          this.todos$$.next(
            todos.map(todo => todo.id === id ? updatedTodo : todo)
          );
        }),
      )
  }

  deleteTodo({ id }: Todo) {
    return this.http.delete<Todo>(`/api/todos/${id}`)
      .pipe(
        withLatestFrom(this.todos$$),
        tap(([_, todos]) => {
          this.todos$$.next(
            todos.filter(todo => todo.id !== id),
          );
        }),
      )
  }
}
