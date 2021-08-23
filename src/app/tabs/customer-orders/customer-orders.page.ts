import { AfterViewInit, Component, OnInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { OrderModel } from 'src/app/models/order-model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CustomerService } from 'src/app/shared/services/customer.service';
import {
  customerAuthToken,
  readStorage,
} from 'src/app/shared/shared/common-utils';
import { CustomerModel } from 'src/app/shared/shared/model/customer-model';
import { OrderDetailComponent } from './order-detail/order-detail.component';

@Component({
  selector: 'app-customer-orders',
  templateUrl: './customer-orders.page.html',
  styleUrls: ['./customer-orders.page.scss'],
})
export class CustomerOrdersPage implements OnInit, AfterViewInit {
  segmentModel = 'new';
  newOrders: OrderModel[] = [];
  closedOrders: OrderModel[] = [];
  customer: CustomerModel;
  customerToken: customerAuthToken;
  constructor(
    private authService: AuthService,
    private customerService: CustomerService,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController
  ) {}
  ngAfterViewInit(): void {
    console.log('newOrders', this.newOrders);
  }

  async ngOnInit() {
    // read token
    this.customerToken = await readStorage('CustomerAuthData');
    this.loadingCtrl
      .create({
        message: 'loading orders.. please wait',
      })
      .then((loadingElmnt) => {
        loadingElmnt.present();
        // read customer information
        this.authService
          .loadUserInfo(
            'Bearer ' + this.customerToken.token,
            this.customerToken.userId
          )
          .subscribe(
            (customerData) => {
              this.customer = customerData.customer;
              // retrive all closed orders list
              this.customerService
                .findOrdersByCustomerAndStatus(
                  'Bearer ' + this.customerToken.token,
                  this.customer.id,
                  'PAYMENT_SUCCESS'
                )
                .subscribe(
                  (closedOrdersResponse) => {
                    this.closedOrders = closedOrdersResponse;
                  },
                  (closedOrdersResponseError) => {
                    loadingElmnt.dismiss();
                    console.log(closedOrdersResponseError);
                  }
                );
              // retrive  all open orders
              this.customerService
                .findOpenCustomerOrders(
                  'Bearer ' + this.customerToken.token,
                  this.customer.id
                )
                .pipe(
                  map((arrayList) =>
                    arrayList.filter((record) =>
                      record ? record.ordStatus !== 'PAYMENT_SUCCESS' : null
                    )
                  )
                )
                .subscribe(
                  (openOrdersResp) => {
                    this.newOrders = openOrdersResp;
                    console.log('newOrders', this.newOrders);
                    loadingElmnt.dismiss();
                  },
                  (openOrderRespError) => {
                    loadingElmnt.dismiss();
                    console.log(openOrderRespError);
                  }
                );
            },
            (customerInfoError) => {
              console.log(customerInfoError);
              loadingElmnt.dismiss();
            }
          );
      });
  }

  onSegmentChanged(event) {
    console.log('Segment changed', event.detail);
    this.segmentModel = event.detail.value;
  }
  openDetails(model: OrderModel) {
    this.modalCtrl
      .create({
        component: OrderDetailComponent,
        componentProps: { order: model },
      })
      .then(async (modalElment) => await modalElment.present());
  }

  logout() {
    this.authService.logout();
  }
}
