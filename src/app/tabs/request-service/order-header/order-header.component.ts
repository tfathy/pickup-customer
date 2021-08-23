import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  ActionSheetController,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { OrderModel } from 'src/app/models/order-model';
import { UserPhoto } from 'src/app/shared/pickers/image-picker/image-picker.component';
import { LookUpService } from 'src/app/shared/services/lookup.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { PhotoService } from 'src/app/shared/services/photo.service';
import { customerAuthToken } from 'src/app/shared/shared/common-utils';
import { LocationTypeModel } from 'src/app/shared/shared/model/location-type-model';
import { ExecuteOrderComponent } from '../execute-order/execute-order.component';
@Component({
  selector: 'app-order-header',
  templateUrl: './order-header.component.html',
  styleUrls: ['./order-header.component.scss'],
})
export class OrderHeaderComponent implements OnInit {
  @Input() hdrRow: OrderModel;
  @Input() customerToken: customerAuthToken;
  form: FormGroup;
  mesiaRecorder: any;
  videoPlayer: any;
  destElvFlag = 'N';
  sourceElvFlag = 'N';
  destElvFlagBoolean = false;
  sourceElvFlagBoolean = false;
  loactionTypes: LocationTypeModel[] = [];

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    public photoService: PhotoService,
    private modalService: ModalService,
    private lookupService: LookUpService,
    public actionSheetController: ActionSheetController
  ) {}

  async ngOnInit() {
    // populate location type lists
    this.loadingCtrl
      .create({
        message: 'loading... pleasewait',
      })
      .then((loadingElmnt) => {
        loadingElmnt.present();
        this.lookupService
          .findAllLocationType('Bearer ' + this.customerToken.token)
          .subscribe(
            (resData) => {
              this.loactionTypes = resData;
              loadingElmnt.dismiss();
            },
            (error) => {
              console.log(error);
              loadingElmnt.dismiss();
            }
          );
      });
    this.form = new FormGroup({
      sourceLocationType: new FormControl(null, []),
      customerNotes: new FormControl(null, []),
      sourceFloorNum: new FormControl(null, []),
      destLocationType: new FormControl(null, []),
      destFloorNum: new FormControl(null, []),
      destElvFlagBoolean: new FormControl(null,[]),
      sourceElvFlagBoolean: new FormControl(null,[])
    });

    /* VoiceRecorder.requestAudioRecordingPermission().then(
      (result: GenericResponse) => console.log(result.value)
    );*/
    await this.photoService.loadSaved();
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

  onImagePicked(event) {
    console.log('event:', event);
  }
  back() {
    this.modalCtrl.dismiss({ executed: false });
  }

  async nextStep() {
    this.hdrRow.customerNotes = this.customerNotes.value;
    this.hdrRow.destElvFlag = this.destElvFlag;
    this.hdrRow.destFloorNum = this.destFloorNum.value;
    this.hdrRow.destLocationType = new LocationTypeModel(
      this.destLocationType.value
    );
    this.hdrRow.sourceFloorNum = this.sourceFloorNum.value;
    this.hdrRow.sourceElvFlag = this.sourceElvFlag;
    this.hdrRow.sourceLocationType = new LocationTypeModel(
      this.sourceLocationType.value
    );
    const modal = await this.modalCtrl.create({
      component: ExecuteOrderComponent,
      componentProps: {
        orderHeader: this.hdrRow,
        customerToken: this.customerToken,
      },
      id: 'OrderHdrModal',
    });
    this.modalService.storeModal(modal);
    return await modal.present();
  }
  get customerNotes() {
    return this.form.get('customerNotes');
  }

  get destFloorNum() {
    return this.form.get('destFloorNum');
  }
  get destLocationType() {
    return this.form.get('destLocationType');
  }
  get sourceFloorNum() {
    return this.form.get('sourceFloorNum');
  }
  get sourceLocationType() {
    return this.form.get('sourceLocationType');
  }
  sourceElvFlagChange() {
    this.sourceElvFlagBoolean = !this.sourceElvFlagBoolean;
    this.sourceElvFlag = this.sourceElvFlagBoolean ? 'Y' : 'N';
  }
  destElvFlagChange() {
    this.destElvFlagBoolean = !this.destElvFlagBoolean;
    this.destElvFlag = this.destElvFlagBoolean ? 'Y' : 'N';
    console.log('this.destElvFlag=',this.destElvFlag);
    console.log('this.destElvFlagBoolean=',this.destElvFlagBoolean);
  }
}
