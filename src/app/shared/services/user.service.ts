/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserResponseData } from '../shared/model/user-response-data';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  url = 'sys-owner-security/owner-auth/update';
  constructor(private http: HttpClient) {}

  updateUser(
    token: string,
    model: UserResponseData,
    userId: string
  ): Observable<UserResponseData> {
    console.log('sys-owner-security/owner-auth/update model=');
    console.log(model);
    const headerInfo = new HttpHeaders({
      Authorization: token,
    });
    return this.http.put<UserResponseData>(
      `${environment.backEndApiRoot}/${this.url}/${userId}`,
      model,
      { headers: headerInfo }
    );
  }
}
