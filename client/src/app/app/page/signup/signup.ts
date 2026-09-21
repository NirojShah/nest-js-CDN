import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  styleUrl: './signup.scss',
  templateUrl: './signup.html',
})
export class Signup {
  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.minLength(2)]],
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
      this.errorMessage = 'Please provide a valid email and password.';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.signup(this.form.getRawValue()).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.successMessage = 'Account created successfully. Redirecting to login...';

        window.setTimeout(() => this.router.navigateByUrl('/login'), 1200);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage =
          error?.error?.message || error?.message || 'Unable to create the account.';
      },
    });
  }
}
