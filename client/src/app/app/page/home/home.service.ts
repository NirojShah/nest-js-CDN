import type { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";

interface IHomeService {
    fetchFiles(): Observable<any>;
    fetchNoOfFiles(): Observable<number>;
    fetchRecentFiles(): Observable<any>;
    uploadFile(file: File): Observable<any>;
}

class HomeService {

    private readonly url = "http://localhost:5005/api/v1/file";

    constructor(private readonly http: HttpClient) { }


}

export default HomeService;