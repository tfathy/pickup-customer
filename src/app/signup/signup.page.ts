/* eslint-disable max-len */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacebookLogin } from '@capacitor-community/facebook-login';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from '../shared/services/auth.service';
import { generatedRandomString } from '../shared/shared/common-utils';
import { CreateCustomerRequestModel } from '../shared/shared/model/create-customer-request-model';
import { CreateUserRequestModel } from '../shared/shared/model/create-user-request-model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  email: string;
  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private http: HttpClient
  ) {}

  async facebookSignUp() {
    const FACEBOOK_PERMISSIONS = ['email', 'user_link'];
    await FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS }).then(
      async (result) => {
        console.log('3');
        if (result.accessToken) {
          console.log('4');
          await this.loadFacebookFeed(result.accessToken);
        }
      }
    );
  }

  ngOnInit() {}

  signUpWithEmail() {
    if (this.email) {
      const model = new CreateCustomerRequestModel(this.email);
      let createUserRequestModel: CreateUserRequestModel;
      const tempPassword = generatedRandomString(4);
      console.log('the model is', model);
      this.loadingCtrl
        .create({
          message: 'please wait...',
        })
        .then((loadingElmnt) => {
          loadingElmnt.present();
          this.authService.createCustomer(model).subscribe(
            (resData) => {
              console.log(
                'responnse returnd from createUserUsingEmail is',
                resData
              );
              console.log(resData);
              createUserRequestModel = new CreateUserRequestModel(
                resData,
                resData.email,
                tempPassword,
                'CUSTOMER',
                'NOT-VERIFIED'
              );
              this.authService
                .createUserUsingEmail(createUserRequestModel)
                .subscribe((userData) => {
                  console.log('userData:', userData);
                  loadingElmnt.dismiss();
                  console.log('user created');
                  this.showAlert(
                    'Username and password are sent to your email. Please check your email inbox'
                  );
                  this.router.navigate(['/', 'login']);
                });
            },
            (error) => {
              loadingElmnt.dismiss();
              console.log('****error*******');
              console.log(error);
            }
          );
        });
    }
  }

  back() {
    this.router.navigate(['/', 'home']);
  }

  private showAlert(msg: string) {
    this.alertCtrl
      .create({
        header: ' User Created',
        message: msg,
        buttons: ['OK'],
      })
      .then((alertElmnt) => {
        alertElmnt.present();
      });
  }

  private async loadFacebookFeed(fbToken: any) {
    const url = `https://graph.facebook.com/me?fields=id,name,picture.width(720),email,gender,link&access_token=${fbToken.token}`;
    let createUserRequestModel: CreateUserRequestModel;
    this.loadingCtrl
      .create({ message: 'Reading facebook feeds.. please wait' })
      .then((loadingElmnt) => {
        loadingElmnt.present();
        this.http.get(url).subscribe((res: any) => {
          const customer = new CreateCustomerRequestModel(
            res.email,
            null,
            res.name,
            res.name,
            res.gender,
            null,
            null,
            null,
            res.link,
            null,
            res.id,
            null
          );
          console.log('customer object info****');
          console.log(customer.email);
          console.log(customer.facebookLink);
          console.log(customer.fbId);
          console.log(customer.fullNameAr);
          console.log(customer.fullNameEn);
          console.log(customer.gender);
          this.authService.createCustomer(customer).subscribe(
            (customerResponse) => {
              console.log('customer created');
              console.log(customerResponse);
              console.log('6');
              createUserRequestModel = new CreateUserRequestModel(
                customerResponse,
                customerResponse.email,
                customerResponse.fbId,
                'CUSTOMER',
                'VERIFIED'
              );
              this.authService
                .createUserUsingEmail(createUserRequestModel)
                .subscribe(
                  (userData) => {
                    this.authService
                      .authLogin(customerResponse.email, customerResponse.fbId)
                      .subscribe((authData) => {
                        loadingElmnt.dismiss();
                        this.router.navigate(['/', 'tabs', 'request-service']);
                      });
                  },
                  (error) => {
                    loadingElmnt.dismiss();
                    console.log(error);
                    this.showAlert(error.status);
                  }
                );
            },
            (error) => {
              console.error('error in authService.createCustomer');
              console.log('7');
              loadingElmnt.dismiss();
            }
          );
        });
      });
  }
}
