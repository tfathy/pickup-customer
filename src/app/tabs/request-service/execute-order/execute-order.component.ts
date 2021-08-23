/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable no-unused-labels */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Component, Input, OnInit } from '@angular/core';

import {
  AlertController,
  LoadingController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { OrderModel } from 'src/app/models/order-model';
import { CustomerService } from 'src/app/shared/services/customer.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { customerAuthToken } from 'src/app/shared/shared/common-utils';

@Component({
  selector: 'app-execute-order',
  templateUrl: './execute-order.component.html',
  styleUrls: ['./execute-order.component.scss'],
})
export class ExecuteOrderComponent implements OnInit {
  @Input() orderHeader: OrderModel;
  @Input() customerToken: customerAuthToken;
  estimatedCost = 500;
  constructor(
    private modalCtrl: ModalController,
    private modalService: ModalService,
    private customerService: CustomerService,
    private alert: AlertController,
    private toast: ToastController,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {}

  back() {
    this.modalCtrl.dismiss({ executed: false });
  }
  cancel() {
    this.closeAllModal();
    this.showToast('Order canceld');
  }
  execute() {
    this.orderHeader.estimateCost = this.estimatedCost;
    this.loadingCtrl
      .create({
        message: 'Sending Order... please wait',
      })
      .then((loadingElmnt) => {
        loadingElmnt.present();
        this.customerService
          .createOrder('Bearer '+this.customerToken.token, this.orderHeader)
          .subscribe((resData) => {
            loadingElmnt.dismiss();
            this.closeAllModal();
            this.showAlert(
              'Your request is sent to all avaliable vehicles.You will get a notification as sson as the request is picked.Thank you'
            );
          },error=>{
            console.log(error);
            loadingElmnt.dismiss();
            this.showAlert('Error. Cannot post order');
          });
      });
  }
  private closeAllModal() {
    for (let i = 0; i < this.modalService.modalInst.length; i++) {
      this.modalService.modalInst[i].dismiss();
    }
  }
  private showAlert(msg: string) {
    this.alert
      .create({
        message: msg,
        buttons: [
          {
            text: 'OK',
          },
        ],
      })
      .then((alertElmnt) => {
        alertElmnt.present();
      });
  }
  private showToast(msg: string) {
    this.toast
      .create({
        message: msg,
        duration: 1000,
        position: 'middle',
      })
      .then((toastElmnt) => {
        toastElmnt.present();
      });
  }
}
