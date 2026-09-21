import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

export interface AuthResponse<T = unknown> {
  statusCode: number;
  message: string;
  data?: T;
  error?: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  email: string;
  password: string;
  name?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000';
  private readonly tokenKey = 'cdn_auth_token';

  login(payload: LoginPayload) {
    return this.http.post<AuthResponse<{ token?: string }>>(
      `${this.apiUrl}/users/login`,
      payload,
    );
  }

  signup(payload: SignupPayload) {
    return this.http.post<AuthResponse<{ id?: string; email?: string }>>(
      `${this.apiUrl}/users`,
      payload,
    );
  }

  saveToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  clearToken() {
    localStorage.removeItem(this.tokenKey);
  }
}
