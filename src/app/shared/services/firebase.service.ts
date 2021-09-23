/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Token } from '@capacitor/push-notifications';
// import { getMessaging } from 'firebase/messaging';
// import { FirebaseApps } from '@angular/fire/app';
// import { getAuth } from 'firebase/auth';
// import { getDatabase,ref, set } from 'firebase/database';

// const database = getDatabase();
// const auth = getAuth();

// function writeUserData(userId, token) {
//   const db = getDatabase();
//   set(ref(db, 'users/' + userId), {
//     fcmToken: token
//   });
//}
@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private url = 'https://pickup-b712c-default-rtdb.firebaseio.com/';
  constructor(private http: HttpClient) {}

  save(postData: { userId: string; fcmToken: Token }): Observable<any> {
    const headerInfo = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PUT, POST, OPTIONS',
      'Access-Control-Allow-Headers': '*'
    });
    return this.http.post<any>(
      `${this.url}/pickup-b712c-default-rtdb/users.json`,
      postData,{headers: headerInfo}
    );
  }
  delete(userId: string): Observable<any> {
    return this.http.delete(
      `${this.url}/pickup-b712c-default-rtdb/users.json/${userId}`
    );
  }
  init(){

  }
}
