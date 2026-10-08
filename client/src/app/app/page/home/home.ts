import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { HomeService, type DashboardFile, type DashboardResponse } from './home.service';
import { PermissionCreation } from './permission-creation/permission-creation';
import type ResponseDto from '../Response-DTO/response.dto';

@Component({
  imports: [CommonModule, PermissionCreation],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home implements OnInit {
  private readonly homeService = inject(HomeService);
  private readonly authService = inject(AuthService);

  protected stats = signal([
    { label: 'Storage used', value: '0 B', detail: 'Waiting for data', tone: 'blue' },
    { label: 'Files', value: '0', detail: 'No uploads yet', tone: 'violet' },
    { label: 'Latest upload', value: '—', detail: 'No activity', tone: 'green' },
  ]);

  protected readonly quickActions = [
    'Upload a new asset',
    'Share a public link',
    'Review analytics',
  ];

  protected recentFiles = signal<DashboardFile[]>([]);

  protected loading = false;
  protected errorMessage = '';

  ngOnInit(): void {
    this.loadDashboardTiles();
    this.fetchRecentFiles();
  }


  protected loadDashboardTiles(): void {
    this.homeService.fetchDashboardTiles().subscribe({
      next: (response) => {
        this.stats.set([
          { label: 'Storage used', value: String(response.data?.size) ?? '0 B', detail: 'Waiting for data', tone: 'blue' },
          { label: 'Files', value: String(response.data?.totalFiles ?? 0), detail: 'No uploads yet', tone: 'violet' },
          { label: 'Latest upload', value: response.data?.lastUploadedFile?.fileName ?? '—', detail: response.data?.lastUploadedFile?.uploadedAt ?? 'No activity', tone: 'green' },
        ])
      },

      error: (error) => {
        this.errorMessage = 'Failed to fetch dashboard data.';
      }
    });
  }


  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.homeService.uploadFile(file).subscribe({
      next: () => {
        this.loading = false;
        input.value = '';
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Upload failed. Please try again.';
      },
    });
  }

  convertToReadableSize(size: string): string {
    const units = ['B', 'KB', 'MB', 'GB'];
    let unitIndex = 0;
    let fileSize = parseFloat(size);

    while (fileSize >= 1024 && unitIndex < units.length - 1) {
      fileSize /= 1024;
      unitIndex++;
    }

    return `${fileSize.toFixed(2)} ${units[unitIndex]}`;
  }

  fetchRecentFiles(): void {
    this.homeService.fetchRecentFiles().subscribe({
      next: (response: ResponseDto<DashboardFile[]>) => {
        this.recentFiles.set(response.data ?? []);
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to fetch recent files.';
      }
    })
  }
}
