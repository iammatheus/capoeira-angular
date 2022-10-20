import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginatedResult } from '@app/models/Pagination';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { Filiado } from '../models/Filiado';

@Injectable()
export class FiliadoService {

  baseURL = `${environment.apiURL}api/filiados`;

  constructor(private http: HttpClient) { }

  public getFiliados(page?: number, itemsPerPage?: number, term?: string): Observable<PaginatedResult<Filiado[]>> {
    const paginatedResult: PaginatedResult<Filiado[]> = new PaginatedResult<Filiado[]>();

    let params = new HttpParams;

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page.toString())
      params = params.append('pageSize', itemsPerPage.toString());
    }

    if (term != null && term != '') {
      params = params.append('term', term);
    }

    return this.http.get<Filiado[]>(this.baseURL, { observe: 'response', params })
      .pipe(
        take(1),
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.has('Pagination')) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'))
          }
          return paginatedResult;
        })
      );
  }

  public getFiliadoById(id: number): Observable<Filiado> {
    return this.http.get<Filiado>(`${this.baseURL}/${id}`);
  }

  public post(filiado: Filiado): Observable<Filiado> {
    return this.http.post<Filiado>(this.baseURL, filiado);
  }

  public put(filiado: Filiado): Observable<Filiado> {
    return this.http.put<Filiado>(`${this.baseURL}/${filiado.id}`, filiado);
  }

  public deleteFiliado(id: number): Observable<any> {
    return this.http.delete(`${this.baseURL}/${id}`);
  }

  postUpload(filiadoId: number, file: File): Observable<Filiado> {
    const fileToUpload = file[0] as File;
    const formData = new FormData();
    formData.append('file', fileToUpload);

    return this.http.post<Filiado>(`${this.baseURL}/upload-image/${filiadoId}`, formData);
  }
}
