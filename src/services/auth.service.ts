import { Injectable } from '@angular/core';
import { User, NormalisedUser } from '../types/interfaces';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;
  constructor(
    private http: HttpClient,
  ) { }

  register(user: User): Observable<User>{
    return this.http.post<User>('/api/auth/register', user)
   }

  login(user: NormalisedUser): Observable<{ token: string }> {
    return this.http.post<{ token: string }>('/api/auth/login', user)
      .pipe(
        tap(
          ({ token }) => {
            localStorage.setItem('auth-token', token)
            this.setToken(token)
          }
        )
      )
  }

  setToken(token: string | null) {
    this.token = token;
  }

  getToken(): string | null {
    return this.token
  }

  isAuth(): boolean {
    return !!this.token
  }

  logout() {
    this.setToken(null)
    localStorage.clear()
  }
}
