import type { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";

interface IHomeService {
    fetchFiles(): Observable<any>;
    fetchNoOfFiles(): Observable<number>;
    fetchRecentFiles(): Observable<any>;
    uploadFile(file: File): Observable<any>;
}
