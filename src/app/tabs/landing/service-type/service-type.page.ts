import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderModel } from 'src/app/models/order-model';
import { OrderService } from 'src/app/shared/services/order.service';

@Component({
  selector: 'app-service-type',
  templateUrl: './service-type.page.html',
  styleUrls: ['./service-type.page.scss'],
})
export class ServiceTypePage implements OnInit {
  requestModel: OrderModel;
  constructor(private orderService: OrderService,private router: Router) {}

  ngOnInit() {
    this.orderService.loadOrder().subscribe((requestData) => {
      this.requestModel = requestData;
      console.log(this.requestModel);
    });
  }
  back(){
    this.router.navigate(['/','tabs','landing']);
  }
  immediateOrder(){
    this.router.navigate(['/','tabs','landing','vcl-size']);
  }
}
