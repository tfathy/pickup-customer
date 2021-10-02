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
  acceptedOrders: OrderModel[] = [];
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

              // retrive  all open orders
              this.customerService
                .findAllOrdersForCustomer(
                  'Bearer ' + this.customerToken.token,
                  this.customer.id
                )
                .subscribe((ordersList) => {
                  this.newOrders = ordersList.filter(row=>row.ordStatus==='REQUEST');
                  this.acceptedOrders = ordersList.filter(row=>row.ordStatus==='ACCEPTED');
                  this.closedOrders  = ordersList.filter(row=>row.ordStatus==='PAYMENT_SUCCESS');
                  loadingElmnt.dismiss();
                });
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
