/* eslint-disable max-len */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FacebookLogin } from '@capacitor-community/facebook-login';
import { LoadingController } from '@ionic/angular';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  token = null;
  constructor(private router: Router, private loadingCtrl: LoadingController, private authService: AuthService) {}

  facebookSignUp(){
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
    const FACEBOOK_PERMISSIONS = [
      'email',
      'user_link',
    ];
    FacebookLogin.login({ permissions: FACEBOOK_PERMISSIONS })
    .then(result=>{
      if (result.accessToken){
        this.token = result.accessToken;
        this.loadingCtrl.create({
          message: 'creating account... please wait'
        }).then(loadingElmnt=>{
          loadingElmnt.present();
          this.authService.saveCustomer(this.token).then(data=>{
            loadingElmnt.dismiss();
            console.log('Customer created',data);
            console.log('next step create user');
          });
        });
      }
    });
  }

  ngOnInit() {}



  back() {
    this.router.navigate(['/', 'home']);
  }

}
