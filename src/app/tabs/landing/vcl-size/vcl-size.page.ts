import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { LookUpService } from 'src/app/shared/services/lookup.service';
import { OrderService } from 'src/app/shared/services/order.service';
import {
  customerAuthToken,
  readStorage,
} from 'src/app/shared/shared/common-utils';
import { VclSizeModel } from 'src/app/shared/shared/model/vcl-size-model';

@Component({
  selector: 'app-vcl-size',
  templateUrl: './vcl-size.page.html',
  styleUrls: ['./vcl-size.page.scss'],
})
export class VclSizePage implements OnInit {
  vclList: VclSizeModel[] = [];
  customerToken: customerAuthToken;
  constructor(
    private router: Router,
    private lookUpService: LookUpService,
    private orderService: OrderService,
    private loadingCtrl: LoadingController
  ) {}

  async ngOnInit() {
    this.customerToken = await readStorage('CustomerAuthData');
    this.loadingCtrl
      .create({
        message: 'loading vehciles ...',
      })
      .then((loadingElment) => {
        loadingElment.present();
        this.lookUpService
          .findAllVclSize('Bearer ' + this.customerToken.token)
          .subscribe((vclData) => {
            this.vclList = vclData;
            loadingElment.dismiss();
          },err=>
          {
            loadingElment.dismiss();
            console.log(err);
          });
      });
  }

  setVclSizeType(vcl: VclSizeModel){
    this.orderService.setVclSize(vcl).subscribe(data=>{
      console.log(data);
      this.router.navigate(['/', 'tabs', 'landing', 'luggage']);
    });
  }
  back() {
    this.router.navigate(['/', 'tabs', 'landing', 'service-type']);
  }
}
