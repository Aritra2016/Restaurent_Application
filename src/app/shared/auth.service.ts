import { Injectable } from '@angular/core';

export interface User {
  name: string;
  email: string;
  mobile: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly USERS_KEY = 'rapp_users';
  private readonly SESSION_KEY = 'rapp_session';

  private getUsers(): User[] {
    return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
  }

  signUp(user: User): { success: boolean; message: string } {
    const users = this.getUsers();
    if (users.find(u => u.email === user.email)) {
      return { success: false, message: 'Email already registered.' };
    }
    users.push(user);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    return { success: true, message: 'Signup successful!' };
  }

  login(email: string, password: string): { success: boolean; user?: User; message: string } {
    const user = this.getUsers().find(u => u.email === email && u.password === password);
    if (!user) return { success: false, message: 'Invalid email or password.' };
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
    return { success: true, user, message: 'Login successful!' };
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
