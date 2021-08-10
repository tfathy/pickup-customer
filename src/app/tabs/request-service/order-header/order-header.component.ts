import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActionSheetController, ModalController } from '@ionic/angular';
import {
  VoiceRecorder,
  VoiceRecorderPlugin,
  RecordingData,
  GenericResponse,
} from 'capacitor-voice-recorder';
import { UserPhoto } from 'src/app/shared/pickers/image-picker/image-picker.component';
import { PhotoService } from 'src/app/shared/services/photo.service';
@Component({
  selector: 'app-order-header',
  templateUrl: './order-header.component.html',
  styleUrls: ['./order-header.component.scss'],
})
export class OrderHeaderComponent implements OnInit {
  form: FormGroup;
  mesiaRecorder: any;
  videoPlayer: any;
  constructor(private modalCtrl: ModalController,public photoService: PhotoService, public actionSheetController: ActionSheetController) {}

  async ngOnInit() {
    this.form = new FormGroup({
      locationType: new FormControl('', []),
      sourceLocationType: new FormControl('', []),
    });

    VoiceRecorder.requestAudioRecordingPermission().then(
      (result: GenericResponse) => console.log(result.value)
    );
    await this.photoService.loadSaved();
  }
  public async showActionSheet(photo: UserPhoto, position: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.photoService.deletePicture(photo, position);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          // Nothing to do, action sheet is automatically closed
         }
      }]
    });
    await actionSheet.present();
  }

  startRecord() {
    VoiceRecorder.hasAudioRecordingPermission().then(
      (result: GenericResponse) => {
        console.log(result.value);
        VoiceRecorder.startRecording()
          .then((recordResult: GenericResponse) => {
            console.log('Recording...*****************************************.');
            console.log(recordResult);
          })
          .catch((error) => console.log(error));
      }
    );
  }

  stopRecord() {
    VoiceRecorder.stopRecording()
      .then((result: RecordingData) => {
        console.log(result.value);
        console.log('Soped...************************************.');
      })

      .catch((error) => console.log(error));
  }
  onImagePicked(event) {
    console.log('event:',event);
  }
  back() {
    this.modalCtrl.dismiss().then((dismissedData) => {});
  }
  nextStep() {}
}
