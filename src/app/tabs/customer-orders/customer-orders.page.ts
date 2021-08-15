import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-orders',
  templateUrl: './customer-orders.page.html',
  styleUrls: ['./customer-orders.page.scss'],
})
export class CustomerOrdersPage implements OnInit {
  segmentModel ='new';
  constructor() { }

  ngOnInit() {
  }

  onSegmentChanged(event) {
    console.log('Segment changed', event.detail);
    this.segmentModel = event.detail.value;
  }
}
