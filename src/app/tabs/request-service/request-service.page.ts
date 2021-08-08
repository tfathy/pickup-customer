import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { OrderModel } from 'src/app/models/order-model';
import { OrderLocationComponent } from './order-location/order-location.component';

@Component({
  selector: 'app-request-service',
  templateUrl: './request-service.page.html',
  styleUrls: ['./request-service.page.scss'],
})
export class RequestServicePage implements OnInit {
  constructor(
    private actionSheet: ActionSheetController,
    private router: Router,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {}
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
    const requestModel= new OrderModel();
    requestModel.requestDate = new Date();
    requestModel.ordStatus = 'NEW';

    this.modalCtrl
      .create({
        component: OrderLocationComponent,
        componentProps:{payLoad: requestModel}
      })
      .then((modalCtrl) => {
        modalCtrl.present();
        modalCtrl.onDidDismiss().then((dismissData) => {});
      });
  }
}
