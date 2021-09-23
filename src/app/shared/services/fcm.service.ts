/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  ActionPerformed,
  PushNotifications,
  PushNotificationSchema,
  Token,
} from '@capacitor/push-notifications';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PushNotificationMessage } from 'src/app/models/push-notification-message';
import { Observable } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { customerAuthToken, readStorage } from '../shared/common-utils';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class FcmService {
  clientAppToken;
  private authData: customerAuthToken;
  private url = 'https://fcm.googleapis.com/fcm/send';

  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private http: HttpClient,
    private firebaseService: FirebaseService
  ) {}
  async initPush() {
    if (Capacitor.getPlatform() !== 'web') {
      this.authData =await readStorage('CustomerAuthData');
      this.registerPush();
    }
  }

  sendNotification(
    msg: PushNotificationMessage
  ): Observable<any> {
    const headerInfo = new HttpHeaders({
      Authorization: `${environment.cloudMessageApplicationId}`,
    });
    console.log('start send notification');
    return this.http.post<any>(`${this.url}`, msg, {
      headers: headerInfo,
    });
  }
  private registerPush() {
    PushNotifications.requestPermissions().then((permission) => {
      if (permission.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        this.showAlert('********************NO permission');
      }
    });

    PushNotifications.addListener('registration', (token: Token) => {
      //  this.showAlert('My token: ' + JSON.stringify(token));
      console.log('token:', JSON.stringify(token));
      // you have to store this token with user id in the database
      this.clientAppToken = token;

    });
    PushNotifications.addListener('registrationError', (error: any) => {
      this.showAlert('Error: ' + JSON.stringify(error));
    });
    PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: PushNotificationSchema) => {
        this.showAlert('Push received: ' + JSON.stringify(notification));
        // fires when notification received
      }
    );
    // the following listner fires when the user has clicked on the notification
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      async (notification: ActionPerformed) => {
        const data = notification.notification.data; // this means retrive the parameters comming with the notification
        this.showAlert(
          'Action performed: ' + JSON.stringify(notification.notification)
        );
        if (data.detailsId) {
          // this.router.navigateByUrl(`/home/${data.detailsId}`);
          this.showAlert(data);
        }
      }
    );
  }

  private showAlert(msg: string) {
    this.alertCtrl
      .create({
        message: msg,
        buttons: ['Ok'],
      })
      .then((alertElmnt) => {
        alertElmnt.present();
      });
  }
}
