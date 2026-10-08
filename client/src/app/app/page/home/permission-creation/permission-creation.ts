import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HomeService, type FileAccess, type PermissionFile } from '../home.service';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-permission-creation',
  styleUrl: './permission-creation.scss',
  templateUrl: './permission-creation.html',
})
export class PermissionCreation implements OnInit {
  private readonly homeService = inject(HomeService);

  protected readonly files = signal<PermissionFile[]>([]);
  protected selectedFileId = '';
  protected accessedBy: FileAccess = 'ALL';
  protected loadingFiles = true;
  protected submitting = false;
  protected errorMessage = '';
  protected successMessage = '';

  ngOnInit(): void {
    this.homeService.fetchFiles().subscribe({
      next: (response) => {
        this.files.set(response.data ?? []);
        this.loadingFiles = false;
      },
      error: (error: unknown) => {
        this.errorMessage = this.getErrorMessage(error, 'Unable to load your files.');
        this.loadingFiles = false;
      },
    });
  }

  protected createPermission(): void {
    if (!this.selectedFileId || this.submitting) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.submitting = true;

    this.homeService.createFilePermission(this.selectedFileId, this.accessedBy).subscribe({
      next: (response) => {
        this.successMessage = response.message || 'Permission created successfully.';
        this.submitting = false;
      },
      error: (error: unknown) => {
        this.errorMessage = this.getErrorMessage(error, 'Unable to create the permission.');
        this.submitting = false;
      },
    });
  }

  private getErrorMessage(error: unknown, fallback: string): string {
    if (typeof error === 'object' && error !== null && 'error' in error) {
      const serverError = error.error;
      if (typeof serverError === 'object' && serverError !== null && 'message' in serverError
        && typeof serverError.message === 'string') {
        return serverError.message;
      }
    }

    if (typeof error === 'object' && error !== null && 'message' in error
      && typeof error.message === 'string') {
      return error.message;
    }

    return fallback;
  }
}
