import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import {
  ActionSheetController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { OrderModel } from 'src/app/models/order-model';
import { OrderLocationComponent } from './order-location/order-location.component';

@Component({
  selector: 'app-request-service',
  templateUrl: './request-service.page.html',
  styleUrls: ['./request-service.page.scss'],
})
export class RequestServicePage implements OnInit {
  currentLocation ={lat:null,lng:null};
  constructor(
    private actionSheet: ActionSheetController,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.loadingCtrl
      .create({
        message: 'Picking current location... please wait',
      })
      .then((loadingElmnt) => {
        loadingElmnt.present();
        Geolocation.getCurrentPosition().then((coordinates) => {
          console.log('Current latitude:', coordinates.coords.latitude);
          console.log('Current longitude:', coordinates.coords.longitude);
          this.currentLocation.lat = coordinates.coords.latitude;
          this.currentLocation.lng = coordinates.coords.longitude;
          loadingElmnt.dismiss();
        },rejected=>{
          loadingElmnt.dismiss();
          console.log(rejected);
        });
      });
  }

  beginOrderAction() {
    this.actionSheet
      .create({
        buttons: [
          {
            text: 'Small Pickup',
            icon: 'assets/icon/vcl-orange.svg',
            handler: () => {
              this.openModal();
            },
          },
          {
            text: 'Meduim Pickup',
            icon: 'assets/icon/vcl-orange.svg',
          },
          {
            text: 'Big Pickup',
            icon: 'assets/icon/vcl-orange.svg',
          },
        ],
      })
      .then((actionSheetElmnt) => {
        actionSheetElmnt.present();
      });
  }
  openModal() {
    const requestModel = new OrderModel();
    requestModel.requestDate = new Date();
    requestModel.ordStatus = 'NEW';

    this.modalCtrl
      .create({
        component: OrderLocationComponent,
        componentProps: { payLoad: requestModel },
      })
      .then((modalCtrl) => {
        modalCtrl.present();
        modalCtrl.onDidDismiss().then((dismissData) => {});
      });
  }
}
