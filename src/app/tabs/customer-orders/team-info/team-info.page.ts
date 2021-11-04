import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { OrderModel } from 'src/app/models/order-model';
import {
  FcmGoogleNotification,
  NotificationMoreInfo,
  PushNotificationMessage,
} from 'src/app/models/push-notification-message';
import { CustomerService } from 'src/app/shared/services/customer.service';
import { DriverService } from 'src/app/shared/services/driver.service';
import { FcmService } from 'src/app/shared/services/fcm.service';
import { UserService } from 'src/app/shared/services/user.service';
import {
  customerAuthToken,
  readStorage,
} from 'src/app/shared/shared/common-utils';

@Component({
  selector: 'app-team-info',
  templateUrl: './team-info.page.html',
  styleUrls: ['./team-info.page.scss'],
})
export class TeamInfoPage implements OnInit {
  orderId;
  order: OrderModel;
  customerToken: customerAuthToken;
  moreInfoText: string;
  msgText: string;
  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private router: Router,
    private fcmService: FcmService,
    private userInfoService: UserService,
    private translateService: TranslateService,
    private loadingCtrl: LoadingController,
    private alert: AlertController
  ) {}

  ngOnInit() {
    this.loadingCtrl
      .create({
        message: 'loading ...',
      })
      .then(async (loadingElmnt) => {
        loadingElmnt.present();
        this.translateService
          .get('CUSTOMER_ACCEPT_OFFER_DETAIL')
          .subscribe((txt) => {
            this.moreInfoText = txt;
          });
        this.translateService
          .get('CUSTOMER_ACCEPT_OFFER_HEADER')
          .subscribe((txt) => {
            this.msgText = txt;
          });

        this.customerToken = await readStorage('CustomerAuthData');
        this.route.paramMap.subscribe(async (params) => {
          this.orderId = params.get('id');
          this.customerService
            .findOrder('Bearer ' + this.customerToken.token, this.orderId)
            .subscribe(
              (orderDataResponse) => {
                this.order = orderDataResponse;
                loadingElmnt.dismiss();
              },
              (error) => {
                console.error(error);
                loadingElmnt.dismiss();
              }
            );
        });
      });
  }
  acceptOffer() {
    this.loadingCtrl
      .create({
        message: 'Sending request ..',
      })
      .then((loadingElmnt) => {
        loadingElmnt.present();
        //send notification to this driver
        // read driver fcmtoken from user table
        this.order.ordStatus = 'CUSTOMER_ACCEPT';
        console.log('order=>',this.order);
        this.userInfoService
          .findBymemberId(
            'Bearer ' + this.customerToken.token,
            this.order.team.manager.id
          )
          .subscribe((driveUserInfoRes) => {
            console.log('driveUserInfoRes', driveUserInfoRes);
            const fcmToke = driveUserInfoRes.fcmToken;
            const moreInfo = new NotificationMoreInfo(this.order);
            const msg: PushNotificationMessage = new PushNotificationMessage(
              this.msgText,
              this.moreInfoText,
              ''
            );
            const fcmGoogleNotification: FcmGoogleNotification =
              new FcmGoogleNotification(msg, moreInfo, fcmToke);
            this.fcmService.sendNotification(fcmGoogleNotification).subscribe(
              (notificationResponse) => {
                console.log(notificationResponse);
                //save order after status update
                this.customerService
                  .updateOrder(
                    'Bearer ' + this.customerToken.token,
                    this.order,
                    this.orderId
                  )
                  .subscribe((res) => {
                    console.log(res);
                    loadingElmnt.dismiss();
                    this.showAlert('YOUR_ACCPT_SENT');
                    this.router.navigate(['/', 'tabs', 'customer-orders']);
                  });

                loadingElmnt.dismiss();
              },
              (err) => {
                console.log(
                  '*******-1 error in fcmService.sendNotification ****'
                );
                console.log(err);
                loadingElmnt.dismiss();
              }
            );
          },eror=>{
            loadingElmnt.dismiss();
            console.log(eror);
          });
      });
  }
  back() {
    this.router.navigate(['/', 'tabs', 'customer-orders']);
  }

  private showAlert(msgKey: string) {
    this.translateService.get(msgKey).subscribe((msgText) => {
      this.alert
        .create({
          message: msgText,
          buttons: [
            {
              text: 'OK',
            },
          ],
        })
        .then((alertElmnt) => {
          alertElmnt.present();
        });
    });
  }
}
