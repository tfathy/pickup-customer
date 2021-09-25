/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AvailabeDriver } from '../shared/model/available-drivers';

@Injectable({
  providedIn: 'root',
})
export class DriverService {
 private  url = 'driver-app/driver';
  constructor(private http: HttpClient) {}

  findAvaialbeDrivers(
    token: string,
    vclSizeId: number
  ): Observable<AvailabeDriver[]> {
    const headerInfo = new HttpHeaders({
      Authorization: token,
    });
    return this.http.get<AvailabeDriver[]>(
      `${environment.backEndApiRoot}/${this.url}/avaliable/${vclSizeId}`,
      { headers: headerInfo }
    );
  }
}
