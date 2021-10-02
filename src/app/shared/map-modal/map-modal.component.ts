/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable object-shorthand */
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { SysUserLogin } from '../shared/model/sys-user-login';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('map', { static: false }) mapElementRef: ElementRef;
  @Input() center = { lat: 21.43531801495943, lng: 39.825938147213115 }; // meca 21.43531801495943, 39.825938147213115
  @Input() selectable = true;
  @Input() closeButtonText = 'Cancel';
  @Input() title = 'Pick Location';
  @Input() showToolbar = true;
  @Input() avaliableCars: SysUserLogin[];
  clickListener: any;
  googleMaps: any;

  googleAutocomplete: any;
  autocomplete: { input: string }={ input: '' };
  autocompleteItems: any[] =[];
  constructor(
    private modalCtrl: ModalController,
    private renderer: Renderer2,
    public zone: NgZone
  ) {}
  ngOnDestroy(): void {
    if (this.clickListener) {
      this.googleMaps.event.removeListener(this.clickListener);
    }
  }

  ngAfterViewInit(): void {
    this.getGoogleMaps()
      .then((googleMaps) => {
        this.googleMaps = googleMaps;
        const mapEl = this.mapElementRef.nativeElement; // the dev
        const map = new googleMaps.Map(mapEl, {
          center: this.center,
          zoom: 16,
        });

        this.googleMaps.event.addListenerOnce(map, 'idle', () => {
          this.renderer.addClass(mapEl, 'visible'); // render the map after is beign ready
        });

        if (this.selectable) {
          this.clickListener = map.addListener('click', (event) => {
            console.log('you clicked on the map-lisner fired');
            const selectedCoords = {
              lat: event.latLng.lat(),
              lng: event.latLng.lng(),
            };
            console.log(selectedCoords);
            this.modalCtrl.dismiss(selectedCoords);
          });
        } else {
          const marker = new googleMaps.Marker({
            position: this.center,
            map: map,
            title: 'Picked Location',
          });
          marker.setMap(map);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  // eslint-disable-next-line @typescript-eslint/naming-convention
  UpdateSearchResults() {
    console.log('********oninput fire');
    if (this.autocomplete.input === '') {
      this.autocompleteItems = [];
      return;
    }
    this.googleAutocomplete = new google.maps.places.AutocompleteService();
    this.googleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
      (predictions, status) => {
        this.autocompleteItems = [];
        this.zone.run(() => {
          predictions.forEach((prediction) => {
            this.autocompleteItems.push(prediction);
          });
        });
      });
  }
  ngOnInit() {}
  SelectSearchResult(item){}
  onCancel() {
    this.modalCtrl.dismiss();
  }
  ClearAutocomplete() {}
  private getGoogleMaps(): Promise<any> {
    const win = window as any;
    const googleModule = win.google;
    if (googleModule && googleModule.maps) {
      return Promise.resolve(googleModule.maps);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src =
        'https://maps.googleapis.com/maps/api/js?key=' +
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
}
