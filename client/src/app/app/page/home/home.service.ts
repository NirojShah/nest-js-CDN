import type { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";

interface IHomeService {
    fetchFiles(): Observable<any>;
    fetchNoOfFiles(): Observable<number>;
    fetchRecentFiles(): Observable<any>;
    uploadFile(file: File): Observable<any>;
}

class HomeService implements IHomeService {

    private readonly url = "http://localhost:5005/api/v1/file";

    constructor(private readonly http: HttpClient) { }

    fetchFiles(): Observable<any> {
        return this.http.get<any>(`${this.url}/files`);
    }

    fetchNoOfFiles(): Observable<number> {
        return this.fetchFiles().pipe(
            // temporary until backend provides a count API
            map((response) => response.data?.length ?? 0)
        );
    }

    fetchRecentFiles(): Observable<any> {

    }

    uploadFile(file: File): Observable<any> {
    }
}

export default HomeService;