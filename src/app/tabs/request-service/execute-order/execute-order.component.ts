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
import {
  NotificationMoreInfo,
  PushNotificationMessage,
} from 'src/app/models/push-notification-message';
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
    const notificationMoreInfo = new NotificationMoreInfo(
      'Click for more details'
    );
    this.msg = new PushNotificationMessage(
      'New Request',
      'You got a new Request',
      '',
      notificationMoreInfo,
      this.fcmService.clientAppToken
    );
    console.log('msg=', this.msg.to);
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
              this.fcmService.sendNotification(this.msg).subscribe((res) => {
                console.log(res);
                this.showAlert('REQUEST_POSTED');
              },err=>{
                console.error('error in send push notification',err);
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
