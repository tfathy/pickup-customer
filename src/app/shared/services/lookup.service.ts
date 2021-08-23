/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { LocationTypeModel } from '../shared/model/location-type-model';

import { VclSizeModel } from '../shared/model/vcl-size-model';

@Injectable({
  providedIn: 'root',
})
export class LookUpService {
  private sysOwnerUrl = 'sys-owner-app';

  constructor(private http: HttpClient) {}

  findAllVclSize(token: string): Observable<VclSizeModel[]> {
    const headerInfo = new HttpHeaders({
      Authorization: token,
    });
    return this.http.get<VclSizeModel[]>(
      `${environment.backEndApiRoot}/${this.sysOwnerUrl}/def/vehicle-size`,
      { headers: headerInfo }
    );
  }

  findAllLocationType(token: string): Observable<LocationTypeModel[]> {
    const headerInfo = new HttpHeaders({
      Authorization: token,
    });
    return this.http.get<LocationTypeModel[]>(
      `${environment.backEndApiRoot}/${this.sysOwnerUrl}/def/location-type`
      ,{headers: headerInfo}
    );
  }
}
