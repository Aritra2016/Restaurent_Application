import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface User {
  id?: number;
  name: string;
  email: string;
  mobile: string;
  password: string;
  role: 'customer' | 'staff' | 'kitchen' | 'driver';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly USERS_KEY = 'rapp_users';
  private readonly SESSION_KEY = 'rapp_session';
  private readonly baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  private getLocalUsers(): User[] {
    return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
  }

  signUp(user: User): { success: boolean; message: string } {
    const users = this.getLocalUsers();
    if (users.find(u => u.email === user.email)) {
      return { success: false, message: 'Email already registered.' };
    }
    users.push(user);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    return { success: true, message: 'Signup successful!' };
  }

  // Checks localStorage first, then falls back to db.json
  login(email: string, password: string): Observable<{ success: boolean; user?: User; message: string }> {
    // 1. Check localStorage users (registered via signup form)
    const localUser = this.getLocalUsers().find(u => u.email === email && u.password === password);
    if (localUser) {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(localUser));
      return of({ success: true, user: localUser, message: 'Login successful!' });
    }

    // 2. Fallback: check db.json seeded users
    return this.http.get<User[]>(`${this.baseUrl}/signup?email=${email}&password=${password}`).pipe(
      map((users: User[]) => {
        if (users && users.length > 0) {
          const user = users[0];
          localStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
          return { success: true, user, message: 'Login successful!' };
        }
        return { success: false, message: 'Invalid email or password.' };
      }),
      catchError(() => of({ success: false, message: 'Login failed. Is the server running?' }))
    );
  }

  logout(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }

  getLoggedInUser(): User | null {
    return JSON.parse(localStorage.getItem(this.SESSION_KEY) || 'null');
  }

  isLoggedIn(): boolean {
    return !!this.getLoggedInUser();
  }
}
