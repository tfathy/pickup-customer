/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable new-parens */
/* eslint-disable prefer-const */
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';
import {
  ActionSheetController,
  LoadingController,
  Platform,
} from '@ionic/angular';
import { finalize } from 'rxjs/operators';
import { AttachmentService } from 'src/app/shared/services/attachment.service';
import { LookUpService } from 'src/app/shared/services/lookup.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { PhotoService, UserPhoto } from 'src/app/shared/services/photo.service';
import {
  customerAuthToken,
  readStorage,
} from 'src/app/shared/shared/common-utils';
import { ItemCategoryModel } from 'src/app/shared/shared/model/item-category-model';

const IMAGE_DIR = 'order-stored-images';

interface LocalFile {
  name: string;
  path: string;
  data: string;
}

@Component({
  selector: 'app-luggage',
  templateUrl: './luggage.page.html',
  styleUrls: ['./luggage.page.scss'],
})
export class LuggagePage implements OnInit {
  images: LocalFile[] = [];
  itemCategoryList: ItemCategoryModel[] = [];
  selectedCategory: ItemCategoryModel;
  customerToken: customerAuthToken;
  customerNotes;
  constructor(
    private router: Router,
    private plt: Platform,
    private http: HttpClient,
    private loadingCrl: LoadingController,
    private actionSheetController: ActionSheetController,
    private lookUpService: LookUpService,
    private orderService: OrderService,
    public photoService: PhotoService
  ) {}

  async ngOnInit() {
    this.loadingCrl
      .create({
        message: 'Loading luggage details ...',
      })
      .then(async (loadingElmnt) => {
        loadingElmnt.present();
        this.loadFiles();
        this.customerToken = await readStorage('CustomerAuthData');
        this.lookUpService
          .findAllItemCategory('Bearer ' + this.customerToken.token)
          .subscribe((itemCatRes) => {
            this.itemCategoryList = itemCatRes;
            loadingElmnt.dismiss();
          });
      });
  }
  async loadFiles() {
    this.images = [];
    Filesystem.readdir({
      path: IMAGE_DIR,
      directory: Directory.Data,
    })
      .then(
        (result) => {
          this.loadFileData(result.files);
        },
        async (err) => {
          // Folder does not yet exists!
          await Filesystem.mkdir({
            path: IMAGE_DIR,
            directory: Directory.Data,
          });
        }
      )
      .then((_) => {
        console.log('loadFiles executed');
      });
  }

  async loadFileData(fileNames: string[]) {
    for (let f of fileNames) {
      const filePath = `${IMAGE_DIR}/${f}`;

      const readFile = await Filesystem.readFile({
        path: filePath,
        directory: Directory.Data,
      });

      this.images.push({
        name: f,
        path: filePath,
        data: `data:image/jpeg;base64,${readFile.data}`,
      });
    }
    console.log('images=', this.images);
  }

  async selectImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt, // Camera, Photos or Prompt!
    });
    console.log('select image =', image);
    if (image) {
      this.saveImage(image);
    }
  }
  // Create a new file from a capture image
  async saveImage(photo: Photo) {
    console.log('inside saveImage image=', photo);
    const base64Data = await this.readAsBase64(photo);

    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: `${IMAGE_DIR}/${fileName}`,
      data: base64Data,
      directory: Directory.Data,
    });
    console.log('savedFile=', savedFile);
    // Reload the file list
    // Improve by only loading for the new image and unshifting array!
    this.loadFiles();
  }

  setItemCategory(event) {
    this.selectedCategory = event.item;
  }

  back() {
    this.router.navigate(['/', 'tabs', 'landing', 'vcl-size']);
  }
  publishOrder() {
    this.orderService.setCategory(this.selectedCategory).subscribe((res) => {
      console.log('order=', res);
      console.log(this.customerNotes);
    });
    this.orderService
      .setCusstomerNotes(this.customerNotes)
      .subscribe((resp) => {
        console.log(resp);
      });
    this.orderService.placeRequest('Bearer ' + this.customerToken.token,this.images);
    this.router.navigate(['/', 'tabs', 'landing']);
    //save order
  }

  async deleteImage(file: LocalFile) {
    await Filesystem.deleteFile({
      directory: Directory.Data,
      path: file.path,
    });
    this.loadFiles();
  }

  private async readAsBase64(photo: Photo) {
    if (this.plt.is('hybrid')) {
      const file = await Filesystem.readFile({
        path: photo.path,
      });

      return file.data;
    } else {
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(photo.webPath);
      const blob = await response.blob();

      return (await this.convertBlobToBase64(blob)) as string;
    }
  }

  convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
}
