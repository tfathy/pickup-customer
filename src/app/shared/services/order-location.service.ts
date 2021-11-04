/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderLocationModel } from 'src/app/models/order-location-model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderLocationService {
  private url = 'driver-app/order-location';
  constructor(private http: HttpClient) {}

  findLastLocation(token: string, orderId): Observable<OrderLocationModel> {
    const headerInfo = new HttpHeaders({
      Authorization: token,
    });
    return this.http.get<OrderLocationModel>(
      `${environment.backEndApiRoot}/${this.url}/last/order/${orderId}`,
      { headers: headerInfo }
    );
  }
}
