/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable no-unused-labels */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import { Component, Input, OnInit } from '@angular/core';

import {
  AlertController,
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { OrderModel } from 'src/app/models/order-model';
import { PushNotificationMessage } from 'src/app/models/push-notification-message';
import { CustomerService } from 'src/app/shared/services/customer.service';
import { FcmService } from 'src/app/shared/services/fcm.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { customerAuthToken } from 'src/app/shared/shared/common-utils';

@Component({
  selector: 'app-execute-order',
  templateUrl: './execute-order.component.html',
  styleUrls: ['./execute-order.component.scss'],
})
export class ExecuteOrderComponent implements OnInit {
  @Input() orderHeader: OrderModel;
  @Input() customerToken: customerAuthToken;
  estimatedCost = 500;
  msg: PushNotificationMessage;
  constructor(
    private modalCtrl: ModalController,
    private modalService: ModalService,
    private customerService: CustomerService,
    private fcmService: FcmService,
    private alert: AlertController,
    private toast: ToastController,
    private loadingCtrl: LoadingController,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    const notification = {
      body: 'This is a Test message',
      title: 'pickup test message',
    };
    this.msg = new PushNotificationMessage('eqp-bDjlSRmKU9U-2J-Id8:APA91bFNiqlPH2odCOrlcacJQ86YtKKDDVaXK4JAjSlPpKO0Wt8gj-AjrrdLPvz7YtfHlksuuPSfyH7MKDnCEcsIuTHiA8XzWTgduLxFH2vjNRcBRZo_hXTbQsZBKZQT9opRg9XzpgcT', notification);
  }

  back() {
    this.modalCtrl.dismiss({ executed: false });
  }
  cancel() {
    this.closeAllModal();
    this.showToast('REQUEST_CANCELED');
  }
  execute() {
    this.orderHeader.estimateCost = this.estimatedCost;
    this.loadingCtrl
      .create({
        message: 'Sending Order... please wait',
      })
      .then((loadingElmnt) => {
        loadingElmnt.present();
        this.customerService
          .createOrder('Bearer ' + this.customerToken.token, this.orderHeader)
          .subscribe(
            (resData) => {
              loadingElmnt.dismiss();
              this.closeAllModal();
              this.fcmService
                .sendNotification(
                  'AAAAkre9i_4:APA91bF-MH7o9dWmjX7SDopJchSi5AyDkX0v7gd4Uul_4eOa25xdn4NZ9IRxlxfuevlS_5ez3RfTJw8xPR15IVbxl-KRhFcn9oXmST_xP-i3qpsQOCQtrblehob6bYB9D-mSKD7cqdVD',
                  'pickup-b712c',
                  this.msg
                )
                .subscribe((res) => {
                  console.log(res);
                  this.showAlert('REQUEST_POSTED');
                });
            },
            (error) => {
              console.log(error);
              loadingElmnt.dismiss();
              this.showAlert('ERROR_CANNOT_POST_REQUEST');
            }
          );
      });
  }
  private closeAllModal() {
    for (let i = 0; i < this.modalService.modalInst.length; i++) {
      this.modalService.modalInst[i].dismiss();
    }
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
  private showToast(msgKey: string) {
    this.translateService.get(msgKey).subscribe((msgText) => {
      this.toast
        .create({
          message: msgText,
          duration: 1000,
          position: 'middle',
        })
        .then((toastCtrl) => {
          toastCtrl.present();
        });
    });
  }
}
