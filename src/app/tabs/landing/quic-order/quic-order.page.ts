import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { OrderModel } from 'src/app/models/order-model';
import {
  customerAuthToken,
  readStorage,
} from 'src/app/shared/shared/common-utils';
import { CustomerModel } from 'src/app/shared/shared/model/customer-model';
import { ItemCategoryModel } from 'src/app/shared/shared/model/item-category-model';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FcmService } from 'src/app/shared/services/fcm.service';
import { LookUpService } from 'src/app/shared/services/lookup.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { PhotoService } from 'src/app/shared/services/photo.service';
import { UserPhoto } from 'src/app/shared/pickers/image-picker/image-picker.component';
import { LocationTypeModel } from 'src/app/shared/shared/model/location-type-model';
import { OrderLocationComponent } from '../../request-service/order-location/order-location.component';

@Component({
  selector: 'app-quic-order',
  templateUrl: './quic-order.page.html',
  styleUrls: ['./quic-order.page.scss'],
})
export class QuicOrderPage implements OnInit {
  orderModel: OrderModel=new OrderModel() ;
  itemCategoryList: ItemCategoryModel[] = [];
  currentLang: string;
  currentLocation = { lat: null, lng: null };
  customerToken: customerAuthToken;
  customer: CustomerModel;
  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private actionSheetController: ActionSheetController,
    private authService: AuthService,
    private lookUpService: LookUpService,
    private modalService: ModalService,
    private translateService: TranslateService,
    private fcmService: FcmService,
    private alert: AlertController,
    public photoService: PhotoService
  ) {}

  async ngOnInit() {
    console.log('***********************************************test******************');
    this.customerToken = await readStorage('CustomerAuthData');
    this.loadingCtrl
      .create({
        message: 'Picking current location... please wait',
      })
      .then((loadingElmnt) => {
        loadingElmnt.present();
        // this.isGpsPermissionEnabled()
        Geolocation.getCurrentPosition().then(
          (coordinates) => {
            this.currentLocation.lat = coordinates.coords.latitude;
            this.currentLocation.lng = coordinates.coords.longitude;

            this.authService
              .loadUserInfo(
                'Bearer ' + this.customerToken.token,
                this.customerToken.userId
              )
              .subscribe(
                (data) => {
                  this.customer = data.customer;
                  this.orderModel.customer = data.customer;
                  this.orderModel.ordStatus ='REQUEST';
                  this.orderModel.requestDate = new Date();
                  this.lookUpService
                    .findAllItemCategory('Bearer ' + this.customerToken.token)
                    .subscribe((itemCatRes) => {
                      this.itemCategoryList = itemCatRes;
                      this.fcmService.initPush();
                      loadingElmnt.dismiss();
                    });
                },
                (error) => {
                  loadingElmnt.dismiss();
                  this.showErrorAlert(error);
                }
              );
          },
          (rejected) => {
            loadingElmnt.dismiss();
            this.showErrorAlert(rejected);
            console.log(rejected);
          }
        );
      });
  }
  async openSourceLocationModal(){
    const modal = await this.modalCtrl.create({
      component: OrderLocationComponent,
      componentProps: {
        payLoad: this.orderModel,
        customerToken: this.customerToken,
      },
      id: 'OrderHdrModal',
    });
    this.modalService.storeModal(modal);
    return await modal.present().then(dismissData=>{
      this.router.navigate(['/','tabs','landing']);
    });
  }

  cancel() {
    this.router.navigate(['/', 'tabs', 'landing']);
  }

  public async showActionSheet(photo: UserPhoto, position: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.photoService.deletePicture(photo, position);
          },
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            // Nothing to do, action sheet is automatically closed
          },
        },
      ],
    });
    await actionSheet.present();
  }

  private showAlert(msgKey: string) {
    this.translateService.get(msgKey).subscribe((msgText) => {
      this.alert
        .create({
          message: msgText,
          buttons: [
            {
              text: 'OK',
            },
          ],
        })
        .then((alertElmnt) => {
          alertElmnt.present();
        });
    });
  }
  private showErrorAlert(msg) {
    this.alert
      .create({
        message: msg,
        buttons: [{ text: 'OK' }],
      })
      .then((alertelmnt) => {
        alertelmnt.present();
      });
  }
}
