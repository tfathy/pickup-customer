import { Component, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';
import { OrderModel } from 'src/app/models/order-model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FcmService } from 'src/app/shared/services/fcm.service';
import { LookUpService } from 'src/app/shared/services/lookup.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import {
  customerAuthToken,
  readStorage,
} from 'src/app/shared/shared/common-utils';
import { CustomActionSheetButton } from 'src/app/shared/shared/model/action-sheet-button';
import { CustomerModel } from 'src/app/shared/shared/model/customer-model';
import { VclSizeModel } from 'src/app/shared/shared/model/vcl-size-model';
import { OrderLocationComponent } from './order-location/order-location.component';

@Component({
  selector: 'app-request-service',
  templateUrl: './request-service.page.html',
  styleUrls: ['./request-service.page.scss'],
})
export class RequestServicePage implements OnInit {
  currentLocation = { lat: null, lng: null };
  customerToken: customerAuthToken;
  customer: CustomerModel;
  currentLang: string;
  buttonsProps: CustomActionSheetButton[] = [];
  constructor(
    private actionSheet: ActionSheetController,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private lookUpService: LookUpService,
    private modalService: ModalService,
    private translateService: TranslateService,
    private fcmService: FcmService,
    private alert: AlertController
  ) {}

  async ngOnInit() {
    this.currentLang = this.translateService.getDefaultLang();
    console.log('currentLang', this.currentLang);
    this.customerToken = await readStorage('CustomerAuthData');
    this.loadingCtrl
      .create({
        message: 'Picking current location... please wait',
      })
      .then((loadingElmnt) => {
        loadingElmnt.present();
       // this.isGpsPermissionEnabled()
        Geolocation.getCurrentPosition().then(
          (coordinates) => {
            this.currentLocation.lat = coordinates.coords.latitude;
            this.currentLocation.lng = coordinates.coords.longitude;
            loadingElmnt.dismiss();
          },
          (rejected) => {
            loadingElmnt.dismiss();
            this.showErrorAlert(rejected);
            console.log(rejected);
          }
        );
      });
    this.loadActionSheetButtons();
    this.authService
      .loadUserInfo(
        'Bearer ' + this.customerToken.token,
        this.customerToken.userId
      )
      .subscribe(
        (data) => {
          this.customer = data.customer;
        },
        (error) => {
          this.showErrorAlert(error);
        }
      );
      this.fcmService.initPush();
  }

 /* async isGpsPermissionEnabled(
    permissions: any
  ): Promise<boolean> {
    return await new Promise((resolve, reject) => {
      if (Capacitor.isNativePlatform()) {
        permissions
          .checkPermission(permissions.PERMISSION.ACCESS_FINE_LOCATION)
          .then(
            (rs) => resolve(rs.hasPermission),
            (err) => {
              this.showErrorAlert(err);
            }
          );
      } else {
        resolve(true); // for browsers
      }
    });
  }
*/
  async loadActionSheetButtons() {
    this.lookUpService
      .findAllVclSize('Bearer ' + this.customerToken.token)
      .pipe(
        map((responseArray) => {
          console.log(responseArray);
          responseArray.map((row) =>
            this.buttonsProps.push(
              new CustomActionSheetButton(
                row.id,
                this.currentLang === 'ar' ? row.descAr : row.descEn,
                null,
                null,
                null
              )
            )
          );
        })
      )
      .subscribe(() => {
        console.log(this.buttonsProps);
      });
  }

  beginOrderAction() {
    const btns = [];
    this.buttonsProps.forEach((e) => {
      btns.push({
        text: e.text,
        icon: e.icon,
        handler: () => {
          this.openModal(new VclSizeModel(e.id, e.text));
        },
      });
    });
    console.log('btns=',btns);
    this.actionSheet
      .create({
        buttons: btns,
      })
      .then((actionSheetElmnt) => {
        actionSheetElmnt.present();
      });
  }
  async openModal(vcl: VclSizeModel) {
    console.log('passing vclsize is',vcl);
    const requestModel = new OrderModel(this.customer, vcl);
    requestModel.requestDate = new Date();
    requestModel.ordStatus = 'REQUEST';
    const modal = await this.modalCtrl.create({
      component: OrderLocationComponent,
      componentProps: {
        payLoad: requestModel,
        customerToken: this.customerToken,
      },
    });
    this.modalService.storeModal(modal);
    return await modal.present();
  }

  async logout() {
    await this.authService.logout();
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
  private showErrorAlert(msg) {
    this.alert
      .create({
        message: msg,
        buttons: [{ text: 'OK' }],
      })
      .then((alertelmnt) => {
        alertelmnt.present();
      });
  }
}
