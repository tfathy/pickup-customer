/* eslint-disable max-len */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { generatedRandomString } from '../shared/common-utils';
import { CreateCustomerRequestModel } from '../shared/model/create-customer-request-model';
import { CreateCustomerResponseModel } from '../shared/model/create-customer-response-model';
import { CreateUserRequestModel } from '../shared/model/create-user-request-model';
import { CreateUserResponseModel } from '../shared/model/create-user-response-model';




@Injectable({
  providedIn: 'root',
})
export class AuthService {
  customerApiUrl = 'customer-app/customer';
  securityApi = 'sys-owner-security/owner-auth/customer';
  customer = {
    email: '',
    fullNameAr: '',
    fullNameEn: '',
    phoneNumber: '',
    facebookLink: '',
    birthDate: null,
    gender: '',
    homeCity: '',
    fbPhotoLink: '',
    fbId: '',
  };

  constructor(private http: HttpClient) {}

  createUserUsingFb(fbToken: any): Promise<any> {
    return this.loadFacebookFeed(fbToken).then((result) => {
      this.http
        .post<any>(
          `${environment.backEndApiRoot}/${this.customerApiUrl}`,
          this.customer
        )
        .subscribe((data) => {
          console.log('customer data saved');
        });
    });
  }

  createCustomerUsingEmail(body: CreateCustomerRequestModel): Observable<CreateCustomerResponseModel> {
    // create customer
    return this.http
      .post<CreateCustomerResponseModel>(
        `${environment.backEndApiRoot}/${this.customerApiUrl}`,
        body
      );
  }


  createUserUsingEmail(createUserRequestModel: CreateUserRequestModel): Observable<CreateUserResponseModel>{
    return  this.http.post<CreateUserResponseModel>(
      `${environment.backEndApiRoot}/${this.securityApi}`,
      createUserRequestModel
    );
  }


  private async loadFacebookFeed(fbToken: any) {
    const url = `https://graph.facebook.com/me?fields=id,name,picture.width(720),link,hometown,location,accounts,likes,email,gender,birthday&access_token=${fbToken.token}`;
    this.http.get(url).subscribe((res: any) => {
      this.customer = res;
      console.log(this.customer);
      console.log(this.customer.email);
      console.log(this.customer.fullNameEn);
      console.log(this.customer.fbId);
      console.log(this.customer.birthDate);
      console.log(this.customer.gender);
      console.log(this.customer.homeCity);
      /* this.creds.userEmail = this.user.email;
      this.creds.password = this.user.id;
      this.newUser = new SignUpRequestModel(
        null,
        'PUBLIC',
        this.user.email,
        this.user.id,
        this.user.name,
        this.user.name,
        this.user.email,
        null,
        this.user.gender.toUpperCase(),
        new Date(this.user.birthday),
        null,
        null
      );*/
    });
  }
}
