/* eslint-disable max-len */
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
  token = null;
  email: string;
  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private alertCtrl: AlertController
  ) {}

  facebookSignUp() {
    /*const FACEBOOK_PERMISSIONS = [
      'email',
      'user_birthday',
      'user_photos',
      'user_gender',
      'user_hometown',
      'user_location',
      'user_likes',
      'user_link',
    ];*/
    const FACEBOOK_PERMISSIONS = ['email', 'user_link'];
    FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS }).then(
      (result) => {
        if (result.accessToken) {
          this.token = result.accessToken;
          this.loadingCtrl
            .create({
              message: 'creating account... please wait',
            })
            .then((loadingElmnt) => {
              loadingElmnt.present();
              this.authService.createUserUsingFb(this.token).then((data) => {
                loadingElmnt.dismiss();
                console.log('Customer created', data);
                console.log('next step create user');
              });
            });
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
          this.authService.createCustomerUsingEmail(model).subscribe(
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
}
