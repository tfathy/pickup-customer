import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { PlaceLocation } from 'src/app/models/location-model';
import { OrderModel } from 'src/app/models/order-model';
import {
  FcmGoogleNotification,
  NotificationMoreInfo,
  PushNotificationMessage,
} from 'src/app/models/push-notification-message';
import { CustomerModel } from '../shared/model/customer-model';
import { ItemCategoryModel } from '../shared/model/item-category-model';
import { VclSizeModel } from '../shared/model/vcl-size-model';
import { CustomerService } from './customer.service';
import { DriverService } from './driver.service';
import { FcmService } from './fcm.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private requestModel: OrderModel = {};
  private availabeDrivers;
  constructor(
    private driverService: DriverService,
    private fcmService: FcmService,
    private loadingCtrl: LoadingController,
    private customerService: CustomerService,
    private alert: AlertController,
    private translateService: TranslateService
  ) {}

  initializeRequest(customer: CustomerModel): Observable<OrderModel> {
    this.requestModel = new OrderModel(customer);
    this.requestModel.requestDate = new Date();
    this.requestModel.ordStatus = 'REQUEST';
    return of(this.requestModel);
  }

  loadOrder(): Observable<OrderModel> {
    return of(this.requestModel);
  }

  setSourceLocation(place: PlaceLocation) {
    this.requestModel.sourceLong = place.lng;
    this.requestModel.sourceLat = place.lat;
    this.requestModel.sourceFormattedAddress = place.address;
    this.requestModel.sourceMapImage = place.staticMapImageUrl;
  }
  setDestLocation(place: PlaceLocation) {
    this.requestModel.destLong = place.lng;
    this.requestModel.destLat = place.lat;
    this.requestModel.destFormattedAddress = place.address;
    this.requestModel.destImageMap = place.staticMapImageUrl;
  }
  setVclSize(vcl: VclSizeModel): Observable<OrderModel> {
    this.requestModel.vehicleSize = vcl;
    return of(this.requestModel);
  }

  setCategory(cat: ItemCategoryModel): Observable<OrderModel> {
    this.requestModel.itemCategory = cat;
    return of(this.requestModel);
  }
  setCusstomerNotes(notes): Observable<OrderModel> {
    this.requestModel.customerNotes = notes;
    return of(this.requestModel);
  }

  placeRequest(token) {
    this.driverService
      .findAvaialbeDrivers(token, this.requestModel.vehicleSize.id)
      .subscribe(
        (driverData) => {
          console.log('driverData=', driverData);
          this.availabeDrivers = driverData;

          if (driverData) {
            let fcmGoogleNotification: FcmGoogleNotification;
            let msg: PushNotificationMessage;
            let fcmToke: string;
            // estimated cost should be calculated here
            this.loadingCtrl
              .create({
                message: 'Sending Order... please wait',
              })
              .then((loadingElmnt) => {
                loadingElmnt.present();
                this.customerService
                  .createOrder(token, this.requestModel)
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
