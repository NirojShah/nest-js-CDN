import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import type ResponseDto from '../Response-DTO/response.dto';

export interface DashboardFile {
  id?: string;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  uploadedAt?: string;
  uploadedBy?: string;
}

export interface PermissionFile {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
}

export type FileAccess = 'ALL' | 'UPLOADER';

export interface LastUploadedFile {
  fileName: string;
  uploadedAt: string;
}

export interface DashboardTiles {
  size: number;
  totalFiles: number;
  lastUploadedFile: LastUploadedFile | null;
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
  private readonly url = 'http://localhost:3000';

  fetchRecentFiles(): Observable<ResponseDto<DashboardFile[]>> {
    return this.http.get<ResponseDto<DashboardFile[]>>(`${this.url}/file/latest-uploads`, {
      headers: this.authService.getAuthHeaders(),
    })
  }

  fetchFiles(): Observable<ResponseDto<PermissionFile[]>> {
    return this.http.get<ResponseDto<PermissionFile[]>>(`${this.url}/file/files?limit=100`, {
      headers: this.authService.getAuthHeaders(),
    });
  }

  createFilePermission(fileId: string, accessedBy: FileAccess): Observable<ResponseDto<unknown>> {
    return this.http.post<ResponseDto<unknown>>(
      `${this.url}/file/${encodeURIComponent(fileId)}/permissions`,
      { accessedBy },
      { headers: this.authService.getAuthHeaders() },
    );
  }

  uploadFile(file: File): Observable<DashboardResponse<DashboardFile>> {
    const formData = new FormData();

    formData.append('file', file);
    formData.append('fileName', file.name);
    formData.append('fileSize', String(file.size));
    formData.append(
      'fileType',
      file.type || 'application/octet-stream'
    );

    return this.http.post<DashboardResponse<DashboardFile>>(
      `${this.url}/upload`,
      formData,
      {
        headers: this.authService.getAuthHeaders(),
      }
    );
  }

  fetchDashboardTiles(): Observable<DashboardResponse<DashboardTiles>> {
    return this.http.get<DashboardResponse<DashboardTiles>>(
      `${this.url}/dashboard/tiles`,
      {
        headers: this.authService.getAuthHeaders(),
      }
    );
  }
}