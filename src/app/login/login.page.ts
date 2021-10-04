import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FacebookLogin } from '@capacitor-community/facebook-login';
import { LoadingController, ToastController } from '@ionic/angular';

import { environment } from 'src/environments/environment';
import { AuthService } from '../shared/services/auth.service';
import { readStorage } from '../shared/shared/common-utils';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  emailLoginForm: FormGroup;
  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.emailLoginForm = new FormGroup({
      username: new FormControl('', [Validators.email, Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

  loginAction() {
    this.loadingCtrl
      .create({
        message: 'Log in .... please wait',
      })
      .then((loadingElmnt) => {
        loadingElmnt.present();
        this.authService
          .authLogin(this.username.value, this.password.value)
          .subscribe(
            () => {
              readStorage('CustomerAuthData').then((storageData) => {
                const status = storageData.accountStatus;
                if (status === 'NOT-VERIFIED') {
                  this.showToast(
                    'Please complete your profile information',
                    3000
                  );
                  this.router.navigate([
                    '/',
                    'tabs',
                    'settings',
                    'user-profile',
                  ]);
                } else {
                  this.router.navigate(['/', 'tabs', 'customer-orders']);
                }
                loadingElmnt.dismiss();
              });
            },
            (error) => {
              loadingElmnt.dismiss();
              console.log(error);
            }
          );
      });
  }

  async fbLogin() {
    const FACEBOOK_PERMISSIONS = ['email', 'user_link'];
    await FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS }).then(
      async (result) => {
        if (result.accessToken) {
          await this.loadFacebookFeed(result.accessToken);
        }
      }
    );
  }
  goSignUp() {
    this.router.navigate(['/', 'signup']);
  }
  back() {
    this.router.navigate(['/', 'tabs','landing']);
  }
  get username() {
    return this.emailLoginForm.get('username');
  }

  get password() {
    return this.emailLoginForm.get('password');
  }
  private showToast(msg: string, durationLimit) {
    this.toastCtrl
      .create({
        message: msg,
        duration: durationLimit,
        position: 'middle',
      })
      .then((toastElmnt) => {
        toastElmnt.present();
      });
  }

  private async loadFacebookFeed(fbToken: any) {
    const url = `${environment.facebookGraphQl}${fbToken.token}`;
    this.loadingCtrl
      .create({
        message: 'Login...please wait',
      })
      .then((loadinElmnt) => {
        loadinElmnt.present();
        this.http.get(url).subscribe(
          (res: any) => {
            console.log(res.email, res.id);
            this.authService.authLogin(res.email, res.id).subscribe(
              () => {
                loadinElmnt.dismiss();
                this.router.navigate(['/', 'tabs', 'request-service']);
              },
              (loginError) => {
                loadinElmnt.dismiss();
                console.log(loginError);
                this.showToast('Login Error', 3000);
              }
            );
          },
          (fbloginError) => {
            loadinElmnt.dismiss();
            console.log(fbloginError);
            this.showToast('fblogin Error', 3000);
          }
        );
      });
  }
}
