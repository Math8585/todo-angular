import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, withLatestFrom } from 'rxjs';
import { Category } from '../types/interfaces';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private APIURL = 'https://todo-app-scp7.onrender.com'
  private categories$$ = new BehaviorSubject<Category[]>([]);

  categories$ = this.categories$$.asObservable();

  private category$$ = new BehaviorSubject<Category | null>(null);

  category$ = this.category$$.asObservable();

  constructor(private http: HttpClient) { }

  loadCategories() {
    return this.http.get<Category[]>(`${this.APIURL}/api/category`).pipe(
      tap((categories) => {
        this.categories$$.next(categories);
      })
    );
  }

  getCategoryById(id: number ): Observable<Category> {
    return this.http.get<Category>(`${this.APIURL}/api/category/${id}`).pipe((tap((category) => {
      this.category$$.next(category)
    })))
  }

  createCategory(name: string) {
    return this.http
      .post<Category>(`${this.APIURL}/api/category`, {
        name,
      })
      .pipe(
        withLatestFrom(this.categories$$),
        tap(([createdCategory, categories]) => {
          this.categories$$.next([...categories, createdCategory]);
        })
      );
  }

  updateCategory({ id, ...data }: Category) {
    return this.http.put<Category>(`${this.APIURL}/api/category/${id}`, data).pipe(
      withLatestFrom(this.categories$$),
      tap(([updatedCategory, categories]) => {
        this.categories$$.next(
          categories.map((category) =>
            category.id === id ? updatedCategory : category
          )
        );
        this.category$$.next(updatedCategory);
      })
    );
  }

  deleteCategory({ id }: Category) {
    return this.http.delete<Category>(`${this.APIURL}/api/category/${id}`)
      .pipe(
        withLatestFrom(this.categories$$),
        tap(([_, categories]) => {
          this.categories$$.next(
            categories.filter(category => category.id !== id),
          );
        }),
      )
  }
}

