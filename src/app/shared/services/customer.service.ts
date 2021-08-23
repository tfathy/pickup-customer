/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderModel } from 'src/app/models/order-model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  url = 'customer-app/customer/order';
  constructor(private http: HttpClient) {}

  createOrder(token: string, order: OrderModel): Observable<OrderModel> {
    const headerInfo = new HttpHeaders({
      Authorization: token,
    });
    console.log(order);
    return this.http.post<OrderModel>(
      `${environment.backEndApiRoot}/${this.url}`,
      order,
      { headers: headerInfo }
    );
  }
}
