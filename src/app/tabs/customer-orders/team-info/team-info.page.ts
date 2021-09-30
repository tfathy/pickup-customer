import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderModel } from 'src/app/models/order-model';
import { CustomerService } from 'src/app/shared/services/customer.service';
import {
  customerAuthToken,
  readStorage,
} from 'src/app/shared/shared/common-utils';

@Component({
  selector: 'app-team-info',
  templateUrl: './team-info.page.html',
  styleUrls: ['./team-info.page.scss'],
})
export class TeamInfoPage implements OnInit {
  orderId;
  order: OrderModel;
  customerToken: customerAuthToken;
  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      this.orderId = params.get('id');
      this.customerToken = await readStorage('CustomerAuthData');
      this.customerService
        .findOrder('Bearer ' + this.customerToken.token, this.orderId)
        .subscribe((orderDataResponse) => {
          this.order = orderDataResponse;
        },error=>{
          console.error(error);
        });
    });
  }
}
