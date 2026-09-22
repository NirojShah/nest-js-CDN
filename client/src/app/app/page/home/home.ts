import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  imports: [CommonModule],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {
  protected readonly stats = [
    { label: 'Storage used', value: '24.6 GB', detail: '+8.2% this month', tone: 'blue' },
    { label: 'Requests', value: '1.4M', detail: '+12.4% vs last week', tone: 'violet' },
    { label: 'Avg. latency', value: '118 ms', detail: '-16 ms improvement', tone: 'green' },
  ];

  protected readonly quickActions = [
    'Upload a new asset',
    'Share a public link',
    'Review analytics',
  ];

  protected readonly recentFiles = [
    { name: 'hero-banner.webp', size: '2.4 MB', type: 'Image', status: 'Published' },
    { name: 'app-report.pdf', size: '840 KB', type: 'Document', status: 'Processing' },
    { name: 'product-demo.mp4', size: '18.2 MB', type: 'Video', status: 'Ready' },
  ];
}
