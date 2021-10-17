import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { OrderModel } from 'src/app/models/order-model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CapHttpService } from 'src/app/shared/services/cap-http.service';
import { Geolocation } from '@capacitor/geolocation';
import { FcmService } from 'src/app/shared/services/fcm.service';
import { LookUpService } from 'src/app/shared/services/lookup.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { customerAuthToken, readStorage } from 'src/app/shared/shared/common-utils';
import { CustomerModel } from 'src/app/shared/shared/model/customer-model';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {
  requestModel: OrderModel;
customerToken: customerAuthToken;
customer: CustomerModel;
currentLang: string;
currentLocation = { lat: null, lng: null };
  constructor(
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
          this.requestModel = new OrderModel(this.customer);
          this.requestModel.requestDate = new Date();
          this.requestModel.ordStatus = 'REQUEST';
        },
        (rejected) => {
          loadingElmnt.dismiss();
          this.showErrorAlert(rejected);
          console.log(rejected);
        }
      );
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
