import { Component, Input, OnInit } from '@angular/core';
import { OrderModel } from 'src/app/models/order-model';

@Component({
  selector: 'app-order-location',
  templateUrl: './order-location.component.html',
  styleUrls: ['./order-location.component.scss'],
})
export class OrderLocationComponent implements OnInit {
@Input() model: OrderModel;
  constructor() { }

  ngOnInit() {}
  doshowLocationPicker(){
  }
}
