/* eslint-disable object-shorthand */
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  ModalController,
} from '@ionic/angular';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Coordinates, PlaceLocation } from 'src/app/models/location-model';
import { environment } from 'src/environments/environment';
import { MapModalComponent } from '../../map-modal/map-modal.component';
import type { PermissionState } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { TranslateService } from '@ngx-translate/core';
export interface PermissionStatus {
  // TODO: change 'location' to the actual name of your alias!
  geolocation: PermissionState;
}

export interface EchoPlugin {
  echo(options: { value: string }): Promise<{ value: string }>;
  checkPermissions(): Promise<PermissionStatus>;
  requestPermissions(): Promise<PermissionStatus>;
}
@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {
  @Output() locationPick = new EventEmitter<PlaceLocation>();
  @Input() showPreview = false;
  @Input() buttonTitle = 'Choose location';
  selectedLocationImage: string;
  isLoading = false;
  constructor(
    private modalCtrl: ModalController,
    private actionSheet: ActionSheetController,
    private http: HttpClient,
    private alertCtrl: AlertController,
    private translateService: TranslateService
  ) {}

  ngOnInit() {}
  onPickLocation() {
    this.actionSheet
      .create({
        header: this.getTranslation('PLEASE_CHHOSE_LOCATION'),
        buttons: [
          {
            text: this.getTranslation('GET_CURRENT_LOCATION'),
            handler: () => {
              this.locateUser();
            },
          },
          {
            text: this.getTranslation('PICK_FROM_MAP'),
            handler: () => {
              this.openMap();
            },
          },
          { text: this.getTranslation('CANCEL'), role: 'cancel' },
        ],
      })
      .then((actionSheetElmnt) => {
        actionSheetElmnt.present();
      });
  }
  private getTranslation(key: string){
    let txt: string;
    this.translateService.get(key)
    .subscribe(msgText=>{
      txt = msgText;
    });
    return txt;
  }

  private openMap() {
    this.modalCtrl.create({ component: MapModalComponent }).then((modalEl) => {
      modalEl.onDidDismiss().then((modalData) => {
        if (!modalData.data) {
          return;
        }
        const coordinates: Coordinates = {
          lat: modalData.data.lat,
          lng: modalData.data.lng,
        };
        this.createPlace(coordinates.lat, coordinates.lng);
      });
      modalEl.present();
    });
  }
  private createPlace(lat: number, lng: number) {
    const pickedLocation: PlaceLocation = {
      lat: lat,
      lng: lng,
      address: null,
      staticMapImageUrl: null,
    };
    this.isLoading = true;
    this.getAddress(lat, lng)
      .pipe(
        switchMap((address) => {
          pickedLocation.address = address;
          return of(
            this.getMapImage(pickedLocation.lat, pickedLocation.lng, 14)
          );
        })
      )
      .subscribe((staticMapImageUrl) => {
        pickedLocation.staticMapImageUrl = staticMapImageUrl;
        this.selectedLocationImage = staticMapImageUrl;
        this.isLoading = false;
        this.locationPick.emit(pickedLocation);
      });
  }

  private locateUser() {
    /*if (!Capacitor.isPluginAvailable('GeoLocation')) {
      this.showAlert();
      return;
    }*/

    Geolocation.requestPermissions().then((result) => {
      console.log('****REQUESTING PERMISSION*****');
      console.log(result.location);
      if (result.location !== 'granted') {
        this.showAlert('ENABLE_LOCATION_ACCESS');
        return;
      }
      this.isLoading = true;
      Geolocation.getCurrentPosition()
        .then((getPosition) => {
          const coordinates: Coordinates = {
            lat: getPosition.coords.latitude,
            lng: getPosition.coords.longitude,
          };
          console.log(coordinates);
          this.createPlace(coordinates.lat, coordinates.lng);
          this.isLoading = false;
        })
        .catch((err) => {
          this.isLoading = false;
          console.log(err);
          this.showAlert('ENABLE_LOCATION_ACCESS');
        });
    });
  }

  private getAddress(lat: number, lng: number) {
    return this.http
      .get<any>(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${environment.googleMapsAPIKey}`
      )
      .pipe(
        map((geoData) => {
          if (!geoData || !geoData.results || geoData.results.length === 0) {
            return null;
          }
          return geoData.results[0].formatted_address;
        })
      );
  }

  private getMapImage(lat: number, lng: number, zoom: number) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
    &markers=color:red%7Clabel:Place%7C${lat},${lng}
    &key=${environment.googleMapsAPIKey}`;
  }

  private showAlert(msgKey: string) {
    this.translateService.get(msgKey).subscribe((msgText) => {
      this.alertCtrl.create({
        header: 'error',
        message:msgText
      });
    });
  }

  private async checkPermission(): Promise<string> {
    let result = 'undefined';
    try {
      result = await Geolocation.requestPermissions().then((data) => {
        console.log('*******************************************');
        console.log(data.location);
        console.log('*******************************************');
        return data.location;
      });
      console.log(result);
      console.log('------------------------');
      return result;
    } catch (e) {
      console.log(JSON.stringify(e));
    }
    return result;
  }
}
