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
import {
  FcmGoogleNotification,
  PushNotificationMessage,
} from 'src/app/models/push-notification-message';
import { Observable } from 'rxjs';
import { customerAuthToken, readStorage } from '../shared/common-utils';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
@Injectable({
  providedIn: 'root',
})
export class FcmService {
  private customerAuthToken: customerAuthToken;
  private url = 'https://fcm.googleapis.com/fcm/send';

  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private http: HttpClient,
    private authService: AuthService,
    private userServices: UserService
  ) {}
  async initPush() {
    if (Capacitor.getPlatform() !== 'web') {
      this.customerAuthToken = await readStorage('CustomerAuthData');
      this.registerPush();
    }
  }

  sendNotification(msg: FcmGoogleNotification): Observable<any> {
    const headerInfo = new HttpHeaders({
      Authorization: `${environment.cloudMessageApplicationId}`,
    });

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
      this.authService
        .loadUserInfo(
          'Bearer ' + this.customerAuthToken.token,
          this.customerAuthToken.userId
        )
        .subscribe(
          (userInfoResponse) => {
            userInfoResponse.fcmToken = token.value;
            this.userServices
              .updateUser(
                'Bearer ' + this.customerAuthToken.token,
                userInfoResponse,
                this.customerAuthToken.userId
              )
              .subscribe(
                (updatedInfoResponse) => {
                  console.log('User fcm token updated', updatedInfoResponse);
                },
                (updateError) => {
                  console.error('error in updating fcmtoken', updateError);
                  this.showAlert('error in updating fcmtoken');
                }
              );
          },
          (loadInfoError) => {
            console.error('error in loading user info ', loadInfoError);
            this.showAlert('error in loading user info ');
          }
        );
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
        // this.showAlert(
        //   'Action performed: ' + JSON.stringify(notification.notification)
        // );
        console.log(notification.notification);
        const orderObj =  JSON.parse(data.info);
        console.log('orderObj=',orderObj);
        if (orderObj.id) {
          this.router.navigateByUrl(
            `/tabs/customer-orders/team-info/${orderObj.id}`
          );
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
