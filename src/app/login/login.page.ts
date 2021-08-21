import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
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
    private authService: AuthService
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
            (loginResponse) => {
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
  back() {
    this.router.navigate(['/', 'home']);
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
}
