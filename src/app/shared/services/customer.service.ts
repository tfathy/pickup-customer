/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderModel } from 'src/app/models/order-model';
import { environment } from 'src/environments/environment';
import { CustomerModel } from '../shared/model/customer-model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  url = 'customer-app';
  constructor(private http: HttpClient) {}

  createOrder(token: string, order: OrderModel): Observable<OrderModel> {
    const headerInfo = new HttpHeaders({
      Authorization: token,
    });
    console.log(order);
    return this.http.post<OrderModel>(
      `${environment.backEndApiRoot}/${this.url}/customer/order`,
      order,
      { headers: headerInfo }
    );
  }
  updateCusstomerData(
    token: string,
    customer: CustomerModel,
    id: number
  ): Observable<CustomerModel> {
    const headerInfo = new HttpHeaders({
      Authorization: token,
    });
    return this.http.put<CustomerModel>(
      `${environment.backEndApiRoot}/${this.url}/customer/${id}`,
      customer,{headers: headerInfo}
    );
  }

  findOrdersByCustomerAndStatus(
    token: string,
    customerId: number,
    ordStatus: string
  ): Observable<OrderModel[]> {
    const headerInfo = new HttpHeaders({
      Authorization: token,
    });
    return this.http.get<OrderModel[]>(
      `${environment.backEndApiRoot}/${this.url}/customer/order/status/${customerId}/${ordStatus}`,
      { headers: headerInfo }
    );
  }

  findOpenCustomerOrders(
    token: string,
    customerId: number
  ): Observable<OrderModel[]> {
    const headerInfo = new HttpHeaders({
      Authorization: token,
    });
    console.log(
      'findOpernOrders=',
      `${environment.backEndApiRoot}/${this.url}/customer/order/${customerId}`
    );
    return this.http.get<OrderModel[]>(
      `${environment.backEndApiRoot}/${this.url}/customer/order/customer/${customerId}`,
      { headers: headerInfo }
    );
  }
}
