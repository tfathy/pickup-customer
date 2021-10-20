import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, LoadingController } from '@ionic/angular';
import { LookUpService } from 'src/app/shared/services/lookup.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { PhotoService, UserPhoto } from 'src/app/shared/services/photo.service';
import {
  customerAuthToken,
  readStorage,
} from 'src/app/shared/shared/common-utils';
import { ItemCategoryModel } from 'src/app/shared/shared/model/item-category-model';

@Component({
  selector: 'app-luggage',
  templateUrl: './luggage.page.html',
  styleUrls: ['./luggage.page.scss'],
})
export class LuggagePage implements OnInit {
  itemCategoryList: ItemCategoryModel[] = [];
  selectedCategory: ItemCategoryModel;
  customerToken: customerAuthToken;
  customerNotes;
  constructor(
    private router: Router,
    private loadingCrl: LoadingController,
    private actionSheetController: ActionSheetController,
    private lookUpService: LookUpService,
    private orderService: OrderService,
    public photoService: PhotoService
  ) {}

  ngOnInit() {
    this.loadingCrl
      .create({
        message: 'Loading luggage details ...',
      })
      .then(async (loadingElmnt) => {
        loadingElmnt.present();
        this.customerToken = await readStorage('CustomerAuthData');
        this.lookUpService
          .findAllItemCategory('Bearer ' + this.customerToken.token)
          .subscribe((itemCatRes) => {
            this.itemCategoryList = itemCatRes;
            loadingElmnt.dismiss();
          });
      });
  }

  setItemCategory(event) {
    this.selectedCategory = event.item;
  }

  back() {
    this.router.navigate(['/', 'tabs', 'landing', 'vcl-size']);
  }
  publishOrder(){
    this.orderService.setCategory(this.selectedCategory).subscribe(
      res=>{
        console.log('order=',res);
        console.log(this.customerNotes);
      }
    );
    this.orderService.setCusstomerNotes(this.customerNotes).subscribe(
      resp=>{
        console.log(resp);
      }
    );
      this.orderService.placeRequest('Bearer '+this.customerToken.token);
      this.router.navigate(['/', 'tabs', 'landing']);
    //save order
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
}
