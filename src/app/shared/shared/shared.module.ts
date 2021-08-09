import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderLocationComponent } from 'src/app/tabs/request-service/order-location/order-location.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { LocationPickerComponent } from '../pickers/location-picker/location-picker.component';
import { MapModalComponent } from '../map-modal/map-modal.component';
import { OrderHeaderComponent } from 'src/app/tabs/request-service/order-header/order-header.component';
import { ImagePickerComponent } from '../pickers/image-picker/image-picker.component';

@NgModule({
  declarations: [
    OrderLocationComponent,
    LocationPickerComponent,
    MapModalComponent,
    OrderHeaderComponent,
    ImagePickerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonicModule,
    ReactiveFormsModule,
  ],
  exports: [
    FormsModule,
    HttpClientModule,
    IonicModule,
    ReactiveFormsModule,
    OrderLocationComponent,
    LocationPickerComponent,
    MapModalComponent,
    OrderHeaderComponent,
    ImagePickerComponent
  ],
})
export class SharedModule {}
