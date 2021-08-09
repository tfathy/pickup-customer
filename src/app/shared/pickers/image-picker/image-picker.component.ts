import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Platform } from '@ionic/angular';
import { Camera, CameraResultType } from '@capacitor/camera';
import { PhotoService } from '../../services/photo.service';

@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  @ViewChild('filePicker', { static: false })
  filePickerRef: ElementRef<HTMLInputElement>;
  @Output() imagePick = new EventEmitter<string | File>();
  @Input() showPreview = false;
  @Input() selectedImage: string;
  usePicker = false;
  constructor(private platform: Platform, public photoService: PhotoService) {}

  ngOnInit() {
    if (
      (this.platform.is('mobile') && !this.platform.is('hybrid')) ||
      this.platform.is('desktop')
    ) {
      this.usePicker = true;
    }
    Camera.requestPermissions().then((res) => {
      console.log(res);
    });
  }
  onPickImage() {
    this.photoService.takePhoto().then((photoTaken) => {
      console.log('photo taken');
      console.log(photoTaken);
            // this.selectedImage = photoTaken.dataUrl;
      // this.imagePick.emit(photoTaken.dataUrl);
    });
  }

  onFileChoosen(event: Event){

  }
}
/* onFileChoosen(event: Event) {
    console.log('It is File chooser');
    const pickedFile = (event.target as HTMLInputElement).files[0];
    if (!pickedFile) {
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = fr.result.toString();
      this.selectedImage = dataUrl;
      this.imagePick.emit(pickedFile);
    };
    fr.readAsDataURL(pickedFile);
  }*/
