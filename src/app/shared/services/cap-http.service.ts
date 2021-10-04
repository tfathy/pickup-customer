/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { Http, HttpOptions } from '@capacitor-community/http';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CapHttpService {
  constructor() {}

  doGet(url) {
    const options: HttpOptions = {
      url,
    };
    return from(Http.get(options));
  }

  doPost(url, token?) {
    const options: HttpOptions = {
      url,
      headers: { Authorization: token },
    };
    return from(Http.post(options));
  }
}
