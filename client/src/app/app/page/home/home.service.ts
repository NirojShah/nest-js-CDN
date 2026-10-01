import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

export interface DashboardFile {
  id?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  uploadedAt?: string;
  uploadedBy?: string;
}

export interface DashboardResponse<T = unknown> {
  statusCode: number;
  message: string;
  data?: T;
  error?: string | null;
}

@Injectable({ providedIn: 'root' })
export class HomeService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly url = 'http://localhost:3000/file';

  fetchFiles(): Observable<DashboardResponse<DashboardFile[]>> {
    return this.http.get<DashboardResponse<DashboardFile[]>>(`${this.url}/files`, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  fetchNoOfFiles(): Observable<number> {
    return this.fetchFiles().pipe(
      map((response) => response.data?.length ?? 0),
    );
  }

  fetchRecentFiles(): Observable<DashboardFile[]> {
    return this.fetchFiles().pipe(
      map((response) => response.data ?? []),
    );
  }

  uploadFile(file: File): Observable<DashboardResponse<DashboardFile>> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    formData.append('fileSize', String(file.size));
    formData.append('fileType', file.type || 'application/octet-stream');

    return this.http.post<DashboardResponse<DashboardFile>>(`${this.url}/upload`, formData, {
      headers: this.authService.getAuthHeaders(),
    });
  }
}
