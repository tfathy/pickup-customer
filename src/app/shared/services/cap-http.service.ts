import { Injectable } from '@angular/core';
import { Http, HttpOptions } from '@capacitor-community/http';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CapHttpService {
  constructor() {}

  doGEt(url) {
    const options: HttpOptions = {
      url,
    };
   return from(  Http.get(options));
  }
}
