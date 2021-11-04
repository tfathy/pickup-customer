/* eslint-disable object-shorthand */
import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { OrderLocationModel } from 'src/app/models/order-location-model';
import { OrderLocationService } from 'src/app/shared/services/order-location.service';
import {
  customerAuthToken,
  readStorage,
} from 'src/app/shared/shared/common-utils';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-track-order',
  templateUrl: './track-order.page.html',
  styleUrls: ['./track-order.page.scss'],
})
export class TrackOrderPage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('map', { static: false }) mapElementRef: ElementRef;
  map;
  marker;
  googleMaps: any;
  customerToken: customerAuthToken;
  orderId;
  orderLocation: OrderLocationModel;
  duration = 10000;
  private timer: any;
  constructor(
    private router: Router,
    private rout: ActivatedRoute,
    private loadingCtrl: LoadingController,
    private renderer: Renderer2,
    public zone: NgZone,
    private orderLocationService: OrderLocationService
  ) {}

  ngOnInit() {
    this.loadingCtrl
      .create({
        message: 'loading shipment location',
      })
      .then(async (loadingElmnt) => {
        loadingElmnt.present();
        this.customerToken = await readStorage('CustomerAuthData');
        this.rout.paramMap.subscribe((params) => {
          this.orderId = params.get('orderId');
          this.orderLocationService
            .findLastLocation(
              'Bearer ' + this.customerToken.token,
              this.orderId
            )
            .subscribe(
              (lastLocationResponse) => {
                this.orderLocation = lastLocationResponse;
                console.log('orderLocation=', this.orderLocation);
                const currentLocation: { lat: number; lng: number } = {
                  lat: +this.orderLocation.lat,
                  lng: +this.orderLocation.lng,
                };

                this.getGoogleMaps()
                  .then((googleMaps) => {
                    this.googleMaps = googleMaps;
                    const mapEl = this.mapElementRef.nativeElement; // the dev
                    console.log('After mapEl', mapEl);
                    const map = new googleMaps.Map(mapEl, {
                      center: currentLocation,
                      zoom: 18,
                    });
                    console.log('map', map);
                    this.map = map;
                    this.googleMaps.event.addListenerOnce(map, 'idle', () => {
                      this.renderer.addClass(mapEl, 'visible'); // render the map after is beign ready
                    });
                    const marker = new googleMaps.Marker({
                      position: currentLocation,
                      icon: 'http://maps.google.com/mapfiles/ms/icons/truck.png',
                      map: map,
                      title: 'Your Shipment',
                    });
                    marker.setMap(map);

                    this.refreshMap(this.duration);
                  })
                  .catch((err) => {
                    console.log(err);
                  });

                loadingElmnt.dismiss();
              },
              (error) => {
                console.log(error);
                loadingElmnt.dismiss();
              }
            );
        });
      });
  }

  ngAfterViewInit() {}

  back() {
    if (this.timer) {
      clearInterval(this.timer);
      console.log('***timer cleared*** exe');
    }
    this.router.navigate(['/', 'tabs', 'customer-orders']);
  }

  ngOnDestroy(): void {
    console.log('***ngOnDestroy*** exe');
    if (this.timer) {
      clearInterval(this.timer);
      console.log('***timer cleared*** exe');
    }
  }

  private getGoogleMaps(): Promise<any> {
    const win = window as any;
    const googleModule = win.google;
    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src =
        'https://maps.googleapis.com/maps/api/js?libraries=places&key=' +
        environment.googleMapsAPIKey;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.onload = () => {
        const loadedGoogleModule = win.google;
        if (loadedGoogleModule && loadedGoogleModule.maps) {
          resolve(loadedGoogleModule.maps);
        } else {
          reject('Google maps SDK not available.');
        }
      };
    });
  }

  private refreshMap(duration: number) {
    if (this.timer) {
      clearInterval(this.timer);
    }
    this.timer = setInterval(() => {
      console.log('*******refreshMap executed********');
      this.drawMarker();
    }, duration);
  }
  private drawMarker() {
    this.orderLocationService
      .findLastLocation('Bearer ' + this.customerToken.token, this.orderId)
      .subscribe((lastLocationRes) => {
        if(this.marker){
          this.marker.setMap(null);
        }

        const currentLocation: { lat: number; lng: number } = {
          lat: +lastLocationRes.lat,
          lng: +lastLocationRes.lng,
        };

        this.map.panTo(currentLocation);
         this.marker = new this.googleMaps.Marker({
          position: currentLocation,
          map: this.map,
          icon: 'http://maps.google.com/mapfiles/ms/icons/truck.png',
          title: 'Your Shipment',
        });
        this.marker.setMap(this.map);
      });
  }
}
