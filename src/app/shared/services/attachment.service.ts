/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderImagesModel } from 'src/app/tabs/landing/luggage/order-image-model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {
  private uploadUrl = 'customer-app/attachment/upload';
  private orderImageApiurl = 'customer-app/attachment/order-images';
  constructor(private http: HttpClient) { }

  uploadFile(token: string,formData: FormData): Observable<any> {
    const headerInfo = new HttpHeaders({
      Authorization: token
    });
    console.log('token=',token);
    console.log('formData=', formData);
    return this.http.post(
      `${environment.backEndApiRoot}/${this.uploadUrl}`,
      formData,{headers: headerInfo}
    );
  }

  saveAttchmentData(token: string,
    body: OrderImagesModel
  ): Observable<OrderImagesModel> {
    const headerInfo = new HttpHeaders({
      Authorization: token
    });
    console.log('orderImage=',body);
    return this.http.post<OrderImagesModel>(
      `${environment.backEndApiRoot}/${this.orderImageApiurl}`,
      body,{headers: headerInfo}
    );
  }
}
