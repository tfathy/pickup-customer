/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable no-unused-labels */
/* eslint-disable @typescript-eslint/no-unused-expressions */

import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  AlertController,
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import { OrderModel } from 'src/app/models/order-model';
import {
  FcmGoogleNotification,
  NotificationMoreInfo,
  PushNotificationMessage,
} from 'src/app/models/push-notification-message';
import { CustomerService } from 'src/app/shared/services/customer.service';
import { DriverService } from 'src/app/shared/services/driver.service';
import { FcmService } from 'src/app/shared/services/fcm.service';
import { LookUpService } from 'src/app/shared/services/lookup.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { customerAuthToken } from 'src/app/shared/shared/common-utils';
import { AvailabeDriver } from 'src/app/shared/shared/model/available-drivers';
import { VclSizeModel } from 'src/app/shared/shared/model/vcl-size-model';

@Component({
  selector: 'app-execute-order',
  templateUrl: './execute-order.component.html',
  styleUrls: ['./execute-order.component.scss'],
})
export class ExecuteOrderComponent implements OnInit {
  @Input() orderHeader: OrderModel;
  @Input() customerToken: customerAuthToken;
  estimatedCost = 500;
  availabeDrivers: AvailabeDriver[] = [];
  vclSizeList: VclSizeModel[] = [];
  currentLang: string;
  constructor(
    private modalCtrl: ModalController,
    private modalService: ModalService,
    private customerService: CustomerService,
    private driverService: DriverService,
    private lookUpService: LookUpService,
    private fcmService: FcmService,
    private alert: AlertController,
    private toast: ToastController,
    private loadingCtrl: LoadingController,
    private translateService: TranslateService,
    private router: Router
  ) {}

  ngOnInit() {
    // get list of avaliable drivers with theere fcmtoken
    //driver-app/driver/avaliable/3
    this.currentLang = this.translateService.getDefaultLang();
    this.loadVclSizeList();
  }

  back() {
    this.modalCtrl.dismiss({ executed: false });
  }
  cancel() {
    this.closeAllModal();
    this.showToast('REQUEST_CANCELED');
  }
  execute() {
    this.driverService
      .findAvaialbeDrivers(
        'Bearer ' + this.customerToken.token,
        this.orderHeader.vehicleSize.id
      )
      .subscribe(
        (driverData) => {
          console.log('driverData=', driverData);
          this.availabeDrivers = driverData;

          if (driverData) {
            let fcmGoogleNotification: FcmGoogleNotification;
            let msg: PushNotificationMessage;
            let fcmToke: string;
            this.orderHeader.estimatedCost = this.estimatedCost;
            this.loadingCtrl
              .create({
                message: 'Sending Order... please wait',
              })
              .then((loadingElmnt) => {
                loadingElmnt.present();
                this.customerService
                  .createOrder(
                    'Bearer ' + this.customerToken.token,
                    this.orderHeader
                  )
                  .subscribe(
                    (resData) => {
                      // loop over array of availabe drivers
                      console.log('*********************1*****************');
                      console.log(this.availabeDrivers);
                      this.availabeDrivers.forEach((driver) => {
                        fcmToke = driver.sysUser.fcmToken;
                        const moreInfo = new NotificationMoreInfo(
                          'more information goes here'
                        );
                        msg = new PushNotificationMessage(
                          'New Request',
                          'You got a new Request',
                          ''
                        );
                        console.log(
                          '*********************2 fcmGoogleNotification object is:*****************'
                        );
                        fcmGoogleNotification = new FcmGoogleNotification(
                          msg,
                          moreInfo,
                          fcmToke
                        );
                        console.log(fcmGoogleNotification);
                        this.fcmService
                          .sendNotification(fcmGoogleNotification)
                          .subscribe(
                            (notificationResponse) => {
                              console.log(notificationResponse);
                              console.log(
                                '*********************3 Notification service executed*****************'
                              );
                            },
                            (err) => {
                              console.log(
                                '*********************-1 error in fcmService.sendNotification *****************'
                              );
                              console.log(err);
                            }
                          );
                      });
                      loadingElmnt.dismiss();
                      this.showAlert('REQUEST_POSTED');
                      this.closeAllModal();
                    },
                    (error) => {
                      console.log(error);
                      loadingElmnt.dismiss();
                      this.showAlert('ERROR_CANNOT_POST_REQUEST');
                    }
                  );
              });
          } else {
            console.log('no drivers');
          }
        },
        (error) => {
          console.error(error);
          this.showAlert('error: cannot get availabe drivers');
        }
      );
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
  private async loadVclSizeList() {
    this.lookUpService
      .findAllVclSize('Bearer ' + this.customerToken.token)
      .pipe(
        map((responseArray) => {
          responseArray.map((row) =>
            this.vclSizeList.push(
              new VclSizeModel(
                row.id,
                this.currentLang === 'ar' ? row.descAr : row.descEn,
                null,
                null
              )
            )
          );
        })
      )
      .subscribe(() => {
        console.log(this.vclSizeList);
      });
  }
}
