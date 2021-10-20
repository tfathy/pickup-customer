/* eslint-disable object-shorthand */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
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
import { MapModalComponent } from 'src/app/shared/map-modal/map-modal.component';
import { Coordinates, PlaceLocation } from 'src/app/models/location-model';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {
  highlightSlideOpts = {
    slidesPerView: 1.05,
    spaceBetween: 5,
    rotate: 50,
    centeredSlides: true,
    loop: true,
    slideShadows: true,

  };
  isLoading = false;
  selectedLocationImage: string;
  requestModel: OrderModel;
customerToken: customerAuthToken;
customer: CustomerModel;
currentLang: string;
middle = [];
currentLocation = { lat: null, lng: null };
  constructor(
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private lookUpService: LookUpService,
    private modalService: ModalService,
    private translateService: TranslateService,
    private fcmService: FcmService,
    private http: HttpClient,
    private alert: AlertController,
    private capHttp: CapHttpService,
    private modalCtrl: ModalController
  ) {}

  async ngOnInit() {
    this.currentLang = this.translateService.getDefaultLang();
    this.requestModel = new OrderModel(this.customer);
    console.log('currentLang', this.currentLang);
    this.customerToken = await readStorage('CustomerAuthData');
    this.loadingCtrl
    .create({
      message: 'Picking current location... please wait',
    })
    .then((loadingElmnt) => {
      loadingElmnt.present();
      this.capHttp
          .doGet('https://customer.pickup-sa.net/data/landing.json')
          .subscribe(
            (res: any) => {
              this.middle = res.data.middle;

            },
            (error) => {
              loadingElmnt.dismiss();
              console.log(error);
            }
          );
      // this.isGpsPermissionEnabled()
      Geolocation.getCurrentPosition().then(
        (coordinates) => {
          this.currentLocation.lat = coordinates.coords.latitude;
          this.currentLocation.lng = coordinates.coords.longitude;
          this.requestModel.requestDate = new Date();
          this.requestModel.ordStatus = 'REQUEST';
          loadingElmnt.dismiss();
        },
        (rejected) => {
          loadingElmnt.dismiss();
          this.showErrorAlert(rejected);
          console.log(rejected);
        }
      );
    });


  }

  onSourceLocationPicked(event: PlaceLocation) {
    console.log(event);
    this.requestModel.sourceLong = event.lng;
    this.requestModel.sourceLat = event.lat;
    this.requestModel.sourceFormattedAddress = event.address;
    this.requestModel.sourceMapImage = event.staticMapImageUrl;
  }
  onDestinationLocationPicked(event) {
    this.requestModel.destLong = event.lng;
    this.requestModel.destLat = event.lat;
    this.requestModel.destFormattedAddress = event.address;
    this.requestModel.destImageMap = event.staticMapImageUrl;
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
