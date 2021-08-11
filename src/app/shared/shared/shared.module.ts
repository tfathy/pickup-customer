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
import { ExecuteOrderComponent } from 'src/app/tabs/request-service/execute-order/execute-order.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    OrderLocationComponent,
    LocationPickerComponent,
    MapModalComponent,
    OrderHeaderComponent,
    ImagePickerComponent,
    ExecuteOrderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  exports: [
    FormsModule,
    HttpClientModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule,
    OrderLocationComponent,
    LocationPickerComponent,
    MapModalComponent,
    OrderHeaderComponent,
    ImagePickerComponent,
    ExecuteOrderComponent
  ],
})
export class SharedModule {}
