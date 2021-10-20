/* eslint-disable object-shorthand */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AlertController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { OrderModel } from 'src/app/models/order-model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CapHttpService } from 'src/app/shared/services/cap-http.service';
import { Geolocation } from '@capacitor/geolocation';
import { FcmService } from 'src/app/shared/services/fcm.service';
import { LookUpService } from 'src/app/shared/services/lookup.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import {
  customerAuthToken,
  readStorage,
} from 'src/app/shared/shared/common-utils';
import { CustomerModel } from 'src/app/shared/shared/model/customer-model';
import { MapModalComponent } from 'src/app/shared/map-modal/map-modal.component';
import { Coordinates, PlaceLocation } from 'src/app/models/location-model';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { OrderService } from 'src/app/shared/services/order.service';
import { Router } from '@angular/router';
import { GoogleService } from 'src/app/shared/services/google.service';

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
  destFormattedAddress;
  middle = [];
  currentLocation = { lat: null, lng: null };
  constructor(
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private lookUpService: LookUpService,
    private modalService: ModalService,
    private router: Router,
    private translateService: TranslateService,
    private fcmService: FcmService,
    private http: HttpClient,
    private alert: AlertController,
    private capHttp: CapHttpService,
    private modalCtrl: ModalController,
    private orderService: OrderService,
    private googleService: GoogleService
  ) {}

  async ngOnInit() {
    this.loadingCtrl
      .create({
        message: 'Picking current location... please wait',
      })
      .then((loadingElmnt) => {
        loadingElmnt.present();

        this.currentLang = this.translateService.getDefaultLang();
        readStorage('CustomerAuthData').then((authData) => {
          this.customerToken = authData;
          console.log(' this.customerToken=', this.customerToken);
          this.authService
            .loadUserInfo(
              'Bearer ' + this.customerToken.token,
              this.customerToken.userId
            )
            .subscribe(
              (data) => {
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
                this.customer = data.customer;
                this.orderService
                  .initializeRequest(this.customer)
                  .subscribe((reqData) => {
                    this.requestModel = reqData;

                    Geolocation.getCurrentPosition().then(
                      (coordinates) => {
                        this.currentLocation.lat = coordinates.coords.latitude;
                        this.currentLocation.lng = coordinates.coords.longitude;
                        // need address-----
                        const pickedLocation: PlaceLocation = {
                          lat: this.currentLocation.lat,
                          lng: this.currentLocation.lng,
                          address: null,
                          staticMapImageUrl: null,
                        };

                        this.orderService.setSourceLocation(pickedLocation);
                        loadingElmnt.dismiss();
                      },
                      (rejected) => {
                        this.showErrorAlert(rejected);
                        console.log(rejected);
                      }
                    );
                  });
              },
              (error) => {
                this.showErrorAlert(error);
              }
            );
        });
      });
    this.fcmService.initPush();
  }

  onSourceLocationPicked(event: PlaceLocation) {
    console.log(event);
    // this.requestModel.sourceLong = event.lng;
    // this.requestModel.sourceLat = event.lat;
    // this.requestModel.sourceFormattedAddress = event.address;
    // this.requestModel.sourceMapImage = event.staticMapImageUrl;
    this.orderService.setSourceLocation(event);
  }
  onDestinationLocationPicked(event) {
    // this.requestModel.destLong = event.lng;
    // this.requestModel.destLat = event.lat;
    this.destFormattedAddress = event.address;
    // this.requestModel.destImageMap = event.staticMapImageUrl;

    this.orderService.setDestLocation(event);
  }
  nextPage() {
    this.orderService.loadOrder().subscribe(async (orderInfo) => {
      if (orderInfo.customer && orderInfo.destFormattedAddress) {
        const alertElmnt = this.alert.create({
          message: this.translate('WHAT_IS_START'),
          buttons: [
            {
              text: this.translate('MY_CURRENT_LOCATION'),
              handler: () => {
                const place = this.googleService.getAddressByLatLng(
                  this.currentLocation.lat,this.currentLocation.lng);
                  console.log('place=====',place);
                this.orderService.setSourceLocation(place);
                this.router.navigate(['/', 'tabs', 'landing', 'service-type']);
              },
            },
            {
              text: this.translate('OPNE_MAP'),
              handler: () => {
                console.log('open map');
                this.modalCtrl
                  .create({
                    component: MapModalComponent,
                    componentProps: {
                      center: {
                        lat: this.currentLocation.lat,
                        lng: this.currentLocation.lng,
                      },
                      title: this.translate('SPECIFY_STARTING_POINT'),
                    },
                  })
                  .then((modalResult) => {
                    modalResult.present();
                    modalResult.onDidDismiss().then((dismissedData) => {
                      console.log('after dismiss');
                      console.log(dismissedData.data);
                      // populate placeLocation object and fill the request model
                    this.orderService.setSourceLocation(
                      this.googleService.getAddressByLatLng(
                        dismissedData.data.lat,dismissedData.data.lng));
                      //navigate to the next page
                      this.router.navigate(['/', 'tabs', 'landing', 'service-type']);
                    });
                  });
              },
            },
          ],
        });
        await (await alertElmnt).present();
      } else {
        this.showAlert('PLEASE_CHHOSE_LOCATION');
      }
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
  private translate(key: string): string {
    let text;
    this.translateService.get(key).subscribe((result) => (text = result));
    return text;
  }
}
