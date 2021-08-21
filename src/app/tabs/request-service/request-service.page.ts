import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import {
  ActionSheetController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { OrderModel } from 'src/app/models/order-model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { OrderLocationComponent } from './order-location/order-location.component';

@Component({
  selector: 'app-request-service',
  templateUrl: './request-service.page.html',
  styleUrls: ['./request-service.page.scss'],
})
export class RequestServicePage implements OnInit {
  currentLocation = { lat: null, lng: null };
  constructor(
    private actionSheet: ActionSheetController,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.loadingCtrl
      .create({
        message: 'Picking current location... please wait',
      })
      .then((loadingElmnt) => {
        loadingElmnt.present();
        Geolocation.getCurrentPosition().then(
          (coordinates) => {
            this.currentLocation.lat = coordinates.coords.latitude;
            this.currentLocation.lng = coordinates.coords.longitude;
            loadingElmnt.dismiss();
          },
          (rejected) => {
            loadingElmnt.dismiss();
            console.log(rejected);
          }
        );
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
            icon: 'assets/icon/mid-vcl.svg',
            handler: () => {
              this.openModal();
            },
          },
          {
            text: 'Big Pickup',
            icon: 'assets/icon/big-vcl.svg',
            handler: () => {
              this.openModal();
            },
          },
        ],
      })
      .then((actionSheetElmnt) => {
        actionSheetElmnt.present();
      });
  }
  async openModal() {
    const requestModel = new OrderModel();
    requestModel.requestDate = new Date();
    requestModel.ordStatus = 'NEW';

    const modal = await this.modalCtrl.create({
      component: OrderLocationComponent,
      componentProps: { payLoad: requestModel },
    });
    this.modalService.storeModal(modal);
    return await modal.present();
  }
  logout(){
    this.authService.logout();
  }
}
