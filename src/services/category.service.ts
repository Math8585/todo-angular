import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Category } from '../types/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private http: HttpClient,
  ) { }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`/api/category`);
  }

  getById(id:string): Observable<Category> {
    return this.http.get<Category>(`/api/category${id}`);
    }
}
