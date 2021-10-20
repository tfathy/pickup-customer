/* eslint-disable object-shorthand */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { PlaceLocation } from 'src/app/models/location-model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GoogleService {
  formattedAddress;
  constructor(private http: HttpClient) {}

  getAddressByLatLng(lat: number, lng: number): PlaceLocation {
    const place: PlaceLocation = this.createPlace(lat, lng);
    return place;
  }

  private createPlace(lat: number, lng: number): PlaceLocation {
    const pickedLocation: PlaceLocation = {
      lat: lat,
      lng: lng,
      address: null,
      staticMapImageUrl: null,
    };
    this.getAddress(lat, lng)
      .pipe(
        switchMap((address) => {
          console.log('>>>>>>address',address);
          pickedLocation.address = address;
          this.formattedAddress = address;
          return of(
            this.getMapImage(pickedLocation.lat, pickedLocation.lng, 14)
          );
        })
      )
      .subscribe((staticMapImageUrl) => {
        pickedLocation.staticMapImageUrl = staticMapImageUrl;
        pickedLocation.address = this.formattedAddress;
      });
      console.log('pickedLocation in google services =',pickedLocation);
    return pickedLocation;
  }

  private getAddress(lat: number, lng: number) {
    return this.http
      .get<any>(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&language=ar&key=${environment.googleMapsAPIKey}`
      )
      .pipe(
        map((geoData) => {
          if (!geoData || !geoData.results || geoData.results.length === 0) {
            return null;
          }
          this.formattedAddress = geoData.results[0].formatted_address;
          return geoData.results[0].formatted_address;
        })
      );
  }

  private getMapImage(lat: number, lng: number, zoom: number) {
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=500x300&maptype=roadmap
    &markers=color:red%7Clabel:Place%7C${lat},${lng}
    &key=${environment.googleMapsAPIKey}`;
  }
}
