import { HttpClient, HttpHeaders } from '@angular/common/http';
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

export interface DashboardTiles {
  size: number;
  totalFiles: number;
  lastUploadedFile: DashboardFile | null;
}

export interface DashboardResponse<T = unknown> {
  statusCode: number;
  message: string;
  data?: T;
  error?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  private readonly fileUrl =
    'http://localhost:3000/file';

  private readonly dashboardUrl =
    'http://localhost:3000/dashboard';

  /**
   * Creates the Authorization header for every protected request.
   */
  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();

    console.log(
      'HomeService token:',
      token ? 'Token exists' : 'NO TOKEN',
    );

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  /**
   * Get all files.
   */
  fetchFiles(): Observable<
    DashboardResponse<DashboardFile[]>
  > {
    return this.http.get<
      DashboardResponse<DashboardFile[]>
    >(
      `${this.fileUrl}/files`,
      {
        headers: this.getHeaders(),
      },
    );
  }

  /**
   * Get number of files.
   */
  fetchNoOfFiles(): Observable<number> {
    return this.fetchFiles().pipe(
      map(
        (response) =>
          response.data?.length ?? 0,
      ),
    );
  }

  /**
   * Get recent files.
   */
  fetchRecentFiles(): Observable<DashboardFile[]> {
    return this.fetchFiles().pipe(
      map(
        (response) =>
          response.data ?? [],
      ),
    );
  }

  /**
   * Upload a file.
   */
  uploadFile(
    file: File,
  ): Observable<
    DashboardResponse<DashboardFile>
  > {
    const formData = new FormData();

    formData.append(
      'file',
      file,
    );

    formData.append(
      'fileName',
      file.name,
    );

    formData.append(
      'fileSize',
      String(file.size),
    );

    formData.append(
      'fileType',
      file.type ||
      'application/octet-stream',
    );

    return this.http.post<
      DashboardResponse<DashboardFile>
    >(
      `${this.fileUrl}/upload`,
      formData,
      {
        headers: this.getHeaders(),
      },
    );
  }

  /**
   * Get dashboard tiles.
   */
  fetchTiles(): Observable<DashboardTiles> {
    return this.http
      .get<
        DashboardResponse<DashboardTiles>
      >(
        `${this.dashboardUrl}/tiles`,
        {
          headers: this.getHeaders(),
        },
      )
      .pipe(
        map(
          (response) =>
            response.data ?? {
              size: 0,
              totalFiles: 0,
              lastUploadedFile: null,
            },
        ),
      );
  }
}
