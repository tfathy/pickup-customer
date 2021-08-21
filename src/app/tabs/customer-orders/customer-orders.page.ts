import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-customer-orders',
  templateUrl: './customer-orders.page.html',
  styleUrls: ['./customer-orders.page.scss'],
})
export class CustomerOrdersPage implements OnInit {
  segmentModel ='new';
  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  onSegmentChanged(event) {
    console.log('Segment changed', event.detail);
    this.segmentModel = event.detail.value;
  }
  logout(){
    this.authService.logout();
  }
}
