import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export class Login {
  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  protected isSubmitting = false;
  protected errorMessage = '';
  protected successMessage = '';

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage = 'Please enter a valid email and password.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.login(this.form.getRawValue()).subscribe({
      next: (response) => {
        const token = response.data?.token;

        if (token) {
          this.authService.saveToken(token);
        }

        this.successMessage = 'Welcome back! Redirecting you to your dashboard.';
        this.isSubmitting = false;

        window.setTimeout(() => this.router.navigateByUrl('/'), 900);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage =
          error?.error?.message || error?.message || 'Unable to login right now.';
      },
    });
  }
}
