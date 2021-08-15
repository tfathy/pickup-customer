/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable no-unused-labels */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Component, OnInit } from '@angular/core';

import { AlertController, ModalController, ToastController } from '@ionic/angular';
import { ModalService } from 'src/app/shared/services/modal.service';

@Component({
  selector: 'app-execute-order',
  templateUrl: './execute-order.component.html',
  styleUrls: ['./execute-order.component.scss'],
})
export class ExecuteOrderComponent implements OnInit {
  constructor(
    private modalCtrl: ModalController,
    private modalService: ModalService,
    private alert: AlertController,
    private toast: ToastController
  ) {}

  ngOnInit() {}

  back() {
    this.modalCtrl.dismiss({ executed: false });
  }
  cancel() {
   this.closeAllModal();
   this.showToast('Order canceld');
  }
  execute(){
    this.closeAllModal();
    this.showAlert('Your request is sent to all avaliable vehicles.You will get a notification as sson as the request is picked.Thank you');
  }
  private closeAllModal() {
    for (let i = 0; i < this.modalService.modalInst.length; i++) {
      this.modalService.modalInst[i].dismiss();
    }
  }
  private showAlert(msg: string){
    this.alert.create({
      message: msg,
      buttons:[{
        text: 'OK'
      }]
    }).then(alertElmnt=>{
      alertElmnt.present();
    });
  }
  private showToast(msg: string){
    this.toast.create({
      message: msg,
      duration: 1000,
      position:'middle'
    }).then(toastElmnt=>{
      toastElmnt.present();
    });
  }
}
