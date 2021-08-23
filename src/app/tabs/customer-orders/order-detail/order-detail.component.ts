import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { OrderModel } from 'src/app/models/order-model';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements OnInit {
@Input() order: OrderModel;
  constructor(private modal: ModalController) { }

  ngOnInit() {}

  close(){
    this.modal.dismiss();
  }
}
