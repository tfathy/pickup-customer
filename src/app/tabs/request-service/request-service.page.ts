import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import {
  ActionSheetController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { map } from 'rxjs/operators';
import { OrderModel } from 'src/app/models/order-model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LookUpService } from 'src/app/shared/services/lookup.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import {
  customerAuthToken,
  readStorage,
} from 'src/app/shared/shared/common-utils';
import { CustomActionSheetButton } from 'src/app/shared/shared/model/action-sheet-button';
import { CustomerModel } from 'src/app/shared/shared/model/customer-model';
import { VclSizeModel } from 'src/app/shared/shared/model/vcl-size-model';
import { OrderLocationComponent } from './order-location/order-location.component';

@Component({
  selector: 'app-request-service',
  templateUrl: './request-service.page.html',
  styleUrls: ['./request-service.page.scss'],
})
export class RequestServicePage implements OnInit {
  currentLocation = { lat: null, lng: null };
  customerToken: customerAuthToken;
  customer: CustomerModel;
  buttonsProps: CustomActionSheetButton[] = [];
  constructor(
    private actionSheet: ActionSheetController,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private lookUpService: LookUpService,
    private modalService: ModalService
  ) {}

  async ngOnInit() {
    this.customerToken = await readStorage('CustomerAuthData');
    this.loadingCtrl
      .create({
        message: 'Picking current location... please wait',
      })
      .then((loadingElmnt) => {
        loadingElmnt.present();
        Geolocation.getCurrentPosition().then(
          (coordinates) => {
            this.currentLocation.lat = coordinates.coords.latitude;
            this.currentLocation.lng = coordinates.coords.longitude;
            loadingElmnt.dismiss();
          },
          (rejected) => {
            loadingElmnt.dismiss();
            console.log(rejected);
          }
        );
      });
    this.loadActionSheetButtons();
    this.authService
      .loadUserInfo(
        'Bearer ' + this.customerToken.token,
        this.customerToken.userId
      )
      .subscribe((data) => {
        this.customer = data.customer;
        console.log('this.customer',this.customer);
      },error=>{
        console.log('error in authService',error);
      });
  }

  async loadActionSheetButtons() {
    this.lookUpService
      .findAllVclSize('Bearer ' + this.customerToken.token)
      .pipe(
        map((responseArray) => {
          responseArray.map((row) =>
            this.buttonsProps.push(
              new CustomActionSheetButton(row.id, row.descAr, null, null, null)
            )
          );
        })
      )
      .subscribe(() => {
        console.log(this.buttonsProps);
      });
  }

  beginOrderAction() {
    const btns = [];
    let vcl = null;
    this.buttonsProps.forEach((e) => {
      vcl = new VclSizeModel(e.id, e.text);
      btns.push({
        text: e.text,
        icon: e.icon,
        handler: () => {
          this.openModal(vcl);
        },
      });
    });
    this.actionSheet
      .create({
        buttons: btns,
      })
      .then((actionSheetElmnt) => {
        actionSheetElmnt.present();
      });
  }
  async openModal(vcl: VclSizeModel) {
    const requestModel = new OrderModel(this.customer, vcl);
    requestModel.requestDate = new Date();
    requestModel.ordStatus = 'NEW';
    const modal = await this.modalCtrl.create({
      component: OrderLocationComponent,
      componentProps: { payLoad: requestModel,customerToken: this.customerToken },
    });
    this.modalService.storeModal(modal);
    return await modal.present();
  }

  logout() {
    this.authService.logout();
  }
}
