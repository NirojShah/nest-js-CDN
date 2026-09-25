import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { HomeService, type DashboardFile } from './home.service';

@Component({
  imports: [CommonModule],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home implements OnInit {
  private readonly homeService = inject(HomeService);
  private readonly authService = inject(AuthService);

  protected stats = [
    { label: 'Storage used', value: '0 B', detail: 'Waiting for data', tone: 'blue' },
    { label: 'Files', value: '0', detail: 'No uploads yet', tone: 'violet' },
    { label: 'Latest upload', value: '—', detail: 'No activity', tone: 'green' },
  ];

  protected readonly quickActions = [
    'Upload a new asset',
    'Share a public link',
    'Review analytics',
  ];

  protected recentFiles: Array<{ name: string; size: string; type: string; status: string }> = [];
  protected loading = false;
  protected errorMessage = '';

  ngOnInit(): void {
    this.loadDashboard();
  }

  private loadDashboard(): void {
    this.loading = true;
    this.homeService.fetchRecentFiles().subscribe({
      next: (files) => {
        this.recentFiles = this.mapFiles(files);
        const totalSize = files.reduce((sum, file) => sum + (file.fileSize ?? 0), 0);
        const fileCount = files.length;
        const latest = files[0];

        this.stats = [
          { label: 'Storage used', value: this.formatBytes(totalSize), detail: `${fileCount} files tracked`, tone: 'blue' },
          { label: 'Files', value: String(fileCount), detail: fileCount === 1 ? '1 upload tracked' : `${fileCount} uploads tracked`, tone: 'violet' },
          { label: 'Latest upload', value: latest?.fileName ? this.shortenName(latest.fileName) : '—', detail: latest?.uploadedAt ? new Date(latest.uploadedAt).toLocaleDateString() : 'No activity', tone: 'green' },
        ];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Unable to load the dashboard right now.';
      },
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
        this.loadDashboard();
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Upload failed. Please try again.';
      },
    });
  }

  private mapFiles(files: DashboardFile[]): Array<{ name: string; size: string; type: string; status: string }> {
    return (files ?? []).slice(0, 5).map((file) => ({
      name: file.fileName ?? 'Unnamed file',
      size: this.formatBytes(file.fileSize ?? 0),
      type: file.fileType || 'Unknown',
      status: 'Ready',
    }));
  }

  private formatBytes(bytes: number): string {
    if (!bytes) {
      return '0 B';
    }

    const units = ['B', 'KB', 'MB', 'GB'];
    let value = bytes;
    let index = 0;

    while (value >= 1024 && index < units.length - 1) {
      value /= 1024;
      index += 1;
    }

    return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`;
  }

  private shortenName(name: string): string {
    if (name.length <= 18) {
      return name;
    }

    return `${name.slice(0, 15)}...`;
  }
}
