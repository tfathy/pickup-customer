import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CustomerService } from 'src/app/shared/services/customer.service';
import {
  customerAuthToken,
  readStorage,
} from 'src/app/shared/shared/common-utils';
import { CustomerModel } from 'src/app/shared/shared/model/customer-model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {
  customer: CustomerModel = new CustomerModel();
  customerToken: customerAuthToken;
  constructor(
    private router: Router,
    private authService: AuthService,
    private customerService: CustomerService,
    private loadingCtrl: LoadingController,
    private toast: ToastController
  ) {}

  async ngOnInit() {
    this.loadingCtrl
      .create({
        message: 'Loading profile info ...please wait',
      })
      .then(async (loadingElmnt) => {
        loadingElmnt.present();
        this.customerToken = await readStorage('CustomerAuthData');
        // return customer id  based on userId
        console.log(this.customerToken.userId);
        this.authService
          .loadUserInfo(
            'Bearer ' + this.customerToken.token,
            this.customerToken.userId
          )
          .subscribe(
            (authDataResponse) => {
              this.customer = authDataResponse.customer;
              console.log('this.customer', this.customer);
              loadingElmnt.dismiss();
            },
            (authResponseError) => {
              loadingElmnt.dismiss();
              console.log(authResponseError);
            }
          );
      });
  }

  back() {
    this.router.navigate(['/', 'tabs', 'settings']);
  }
  save() {
    this.loadingCtrl
      .create({
        message: 'posting updates',
      })
      .then((loadingElmnt) => {
        loadingElmnt.present();
        this.customerService
          .updateCusstomerData(
            'Bearer ' + this.customerToken.token,
            this.customer,
            this.customer.id
          )
          .subscribe((responseData) => {
            loadingElmnt.dismiss();
            this.showToast('Profile Updated');
            this.router.navigate(['/', 'tabs', 'settings']);
          },error=>{
            loadingElmnt.dismiss();
          });
      });
  }
  private showToast(msg: string) {
    this.toast
      .create({
        message: msg,
        duration: 1000,
        position: 'middle',
      })
      .then((toastElmnt) => {
        toastElmnt.present();
      });
  }
}
