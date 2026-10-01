import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { forkJoin } from 'rxjs';

import { AuthService } from '../../../services/auth.service';
import {
  HomeService,
  type DashboardFile,
} from './home.service';

interface DashboardStat {
  label: string;
  value: string;
  detail: string;
  tone: 'blue' | 'violet' | 'green';
}

interface RecentFile {
  name: string;
  size: string;
  type: string;
  status: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private readonly homeService = inject(HomeService);
  private readonly authService = inject(AuthService);

  protected stats = signal<DashboardStat[]>([
    {
      label: 'Storage used',
      value: '0 B',
      detail: 'Waiting for data',
      tone: 'blue',
    },
    {
      label: 'Files',
      value: '0',
      detail: 'No uploads yet',
      tone: 'violet',
    },
    {
      label: 'Latest upload',
      value: '—',
      detail: 'No activity',
      tone: 'green',
    },
  ]);

  protected readonly quickActions = [
    'Upload a new asset',
    'Share a public link',
    'Review analytics',
  ];

  protected recentFiles: RecentFile[] = [];

  protected loading = false;
  protected errorMessage = '';

  ngOnInit(): void {
    this.loadDashboard();
  }

  private loadDashboard(): void {
    console.log('Loading dashboard...');

    this.loading = true;
    this.errorMessage = '';

    forkJoin({
      tiles: this.homeService.fetchTiles(),
      files: this.homeService.fetchRecentFiles(),
    }).subscribe({
      next: (response) => {
        console.log('API RESPONSE:', response);

        const tiles = response.tiles;
        const files = response.files ?? [];

        console.log('TILES:', tiles);
        console.log('FILES:', files);

        const totalSize = Number(tiles?.size ?? 0);

        const fileCount = Number(
          tiles?.totalFiles ?? files.length
        );

        const latest = tiles?.lastUploadedFile ?? files[0] ?? null;

        console.log('CALCULATED:', {
          totalSize,
          fileCount,
          latest,
        });

        /*
         * Update recent files.
         */
        this.recentFiles = files
          .slice(0, 5)
          .map((file) => ({
            name: file.fileName ?? 'Unnamed file',
            size: this.formatBytes(
              Number(file.fileSize ?? 0)
            ),
            type: file.fileType || 'Unknown',
            status: 'Ready',
          }));

        /*
         * Update dashboard cards.
         */
        this.stats = signal([
          {
            label: 'Storage used',
            value: this.formatBytes(totalSize),
            detail:
              fileCount === 1
                ? '1 file tracked'
                : `${fileCount} files tracked`,
            tone: 'blue',
          },

          {
            label: 'Files',
            value: String(fileCount),
            detail:
              fileCount === 1
                ? '1 upload tracked'
                : `${fileCount} uploads tracked`,
            tone: 'violet',
          },

          {
            label: 'Latest upload',
            value: latest?.fileName
              ? this.shortenName(latest.fileName)
              : '—',
            detail: latest?.uploadedAt
              ? this.formatDate(latest.uploadedAt)
              : 'No activity',
            tone: 'green',
          },
        ]);

        console.log('FINAL STATS:', this.stats);
        console.log('FINAL RECENT FILES:', this.recentFiles);

        this.loading = false;
      },

      error: (error) => {
        console.error('DASHBOARD ERROR:', error);

        this.loading = false;
        this.errorMessage =
          'Unable to load the dashboard right now.';
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
        input.value = '';

        this.loadDashboard();
      },

      error: (error) => {
        console.error('UPLOAD ERROR:', error);

        this.loading = false;
        this.errorMessage =
          'Upload failed. Please try again.';
      },
    });
  }

  private formatBytes(bytes: number): string {
    if (!bytes || bytes <= 0) {
      return '0 B';
    }

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];

    let value = bytes;
    let index = 0;

    while (
      value >= 1024 &&
      index < units.length - 1
    ) {
      value /= 1024;
      index++;
    }

    const decimals =
      value >= 10 || index === 0
        ? 0
        : 1;

    return `${value.toFixed(decimals)} ${units[index]}`;
  }

  private shortenName(name: string): string {
    if (name.length <= 18) {
      return name;
    }

    return `${name.slice(0, 15)}...`;
  }

  private formatDate(date: string): string {
    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return 'Unknown date';
    }

    return parsed.toLocaleDateString();
  }
}
