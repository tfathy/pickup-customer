import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PlaceLocation } from 'src/app/models/location-model';
import { OrderModel } from 'src/app/models/order-model';
import { ModalService } from 'src/app/shared/services/modal.service';
import { customerAuthToken } from 'src/app/shared/shared/common-utils';
import { OrderHeaderComponent } from '../order-header/order-header.component';

@Component({
  selector: 'app-order-location',
  templateUrl: './order-location.component.html',
  styleUrls: ['./order-location.component.scss'],
})
export class OrderLocationComponent implements OnInit {
  @Input() payLoad: OrderModel;
  @Input() customerToken: customerAuthToken;
  constructor(
    private modalCtrl: ModalController,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    console.log(this.payLoad);
  }

  onSourceLocationPicked(event: PlaceLocation) {
    console.log(event);
    this.payLoad.sourceLong = event.lng;
    this.payLoad.sourceLat = event.lat;
    this.payLoad.sourceFormattedAddress = event.address;
    this.payLoad.sourceMapImage = event.staticMapImageUrl;
  }
  onDestinationLocationPicked(event) {
    this.payLoad.destLong = event.lng;
    this.payLoad.destLat = event.lat;
    this.payLoad.destFormatedAddress = event.address;
    this.payLoad.destMapImage = event.staticMapImageUrl;
  }
  cancel() {
    this.modalCtrl.dismiss();
  }
  async nextStep() {
    if (this.locationsSelected()) {
      console.log('payLoad', this.payLoad);
      const modal = await this.modalCtrl.create({
        component: OrderHeaderComponent,
        componentProps: { hdrRow: this.payLoad ,customerToken: this.customerToken},
      });
      this.modalService.storeModal(modal);
      return await modal.present();
    }
  }

  private locationsSelected(): boolean {
    return (this.payLoad.destLong!=null && this.payLoad.destLong!=null);
  }
}
