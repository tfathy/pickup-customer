import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PlaceLocation } from 'src/app/models/location-model';
import { OrderModel } from 'src/app/models/order-model';
import { ModalService } from 'src/app/shared/services/modal.service';
import { OrderHeaderComponent } from '../order-header/order-header.component';

@Component({
  selector: 'app-order-location',
  templateUrl: './order-location.component.html',
  styleUrls: ['./order-location.component.scss'],
})
export class OrderLocationComponent implements OnInit {
  @Input() payLoad: OrderModel;
  sourceLong;
  sourceLat;
  sourceAddress;
  sourceStaticMapImageUrl;
  destLong;
  destLat;
  destAddress;
  destStaticMapImageUrl;
  constructor(private modalCtrl: ModalController, private modalService: ModalService) {}

  ngOnInit() {
    console.log(this.payLoad);
  }

  onSourceLocationPicked(event: PlaceLocation) {
    console.log(event);
    this.sourceLong = event.lng;
    this.sourceLat = event.lat;
    this.sourceAddress = event.address;
    this.sourceStaticMapImageUrl = event.staticMapImageUrl;
  }
  onDestinationLocationPicked(event) {
    this.destLong = event.lng;
    this.destLat = event.lat;
    this.destAddress = event.address;
    this.destStaticMapImageUrl = event.staticMapImageUrl;
  }
  cancel() {
    this.modalCtrl.dismiss();
  }
  async nextStep() {
    if (this.locationsSelected()) {
      this.payLoad.destFormatedAddress = this.destAddress;
      this.payLoad.destLat = this.destLat;
      this.payLoad.destLong = this.destLong;
      this.payLoad.destMapImage = this.destStaticMapImageUrl;

      this.payLoad.sourceFormattedAddress = this.sourceAddress;
      this.payLoad.sourceLat = this.sourceLat;
      this.payLoad.sourceLong = this.sourceLong;
      this.payLoad.sourceMapImage = this.sourceStaticMapImageUrl;
      console.log(this.payLoad);
    const modal = await  this.modalCtrl
        .create({
          component: OrderHeaderComponent,
          componentProps: { hdrRow: this.payLoad },
        });
       this.modalService.storeModal(modal) ;
       return await modal.present();
    }
  }

  private locationsSelected(): boolean {
    return (
      this.sourceLong &&
      this.sourceLat &&
      this.sourceAddress &&
      this.sourceStaticMapImageUrl &&
      this.destLong &&
      this.destLat &&
      this.destAddress &&
      this.destStaticMapImageUrl
    );
  }
}
