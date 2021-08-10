import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { UserPhoto } from 'src/app/shared/pickers/image-picker/image-picker.component';
import { ModalService } from 'src/app/shared/services/modal.service';
import { PhotoService } from 'src/app/shared/services/photo.service';
import { ExecuteOrderComponent } from '../execute-order/execute-order.component';
@Component({
  selector: 'app-order-header',
  templateUrl: './order-header.component.html',
  styleUrls: ['./order-header.component.scss'],
})
export class OrderHeaderComponent implements OnInit {
  form: FormGroup;
  mesiaRecorder: any;
  videoPlayer: any;
  constructor(
    private modalCtrl: ModalController,
    public photoService: PhotoService,
    private modalService: ModalService,
    public actionSheetController: ActionSheetController
  ) {}

  async ngOnInit() {
    this.form = new FormGroup({
      locationType: new FormControl('', []),
      sourceLocationType: new FormControl('', []),
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
    const modal = await this.modalCtrl.create({
      component: ExecuteOrderComponent,
      id: 'OrderHdrModal',
    });
    this.modalService.storeModal(modal);
    return await modal.present();
  }
}
