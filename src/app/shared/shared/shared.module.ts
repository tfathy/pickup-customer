/* eslint-disable prefer-arrow/prefer-arrow-functions */
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
import { OrderDetailComponent } from '../../../app/tabs/customer-orders/order-detail/order-detail.component';
import { HideHeaderDirective } from '../../../app/directives/hide-header.directive';
import { ParallaxDirective } from '../../../app/directives/parallax.directive';
import { OrderItemCatComponent } from '../../../app/tabs/landing/components/order-item-cat/order-item-cat.component';
import { IonicSelectableModule } from 'ionic-selectable';


@NgModule({
  declarations: [
    ParallaxDirective,
    HideHeaderDirective,
    OrderLocationComponent,
    LocationPickerComponent,
    MapModalComponent,
    OrderHeaderComponent,
    ImagePickerComponent,
    ExecuteOrderComponent,
    OrderDetailComponent,
    OrderItemCatComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonicModule,
    IonicSelectableModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  exports: [
    FormsModule,
    HttpClientModule,
    IonicModule,
    ReactiveFormsModule,
    TranslateModule,
    IonicSelectableModule,
    OrderLocationComponent,
    LocationPickerComponent,
    MapModalComponent,
    OrderHeaderComponent,
    ImagePickerComponent,
    ExecuteOrderComponent,
    OrderDetailComponent,
    ParallaxDirective,
    HideHeaderDirective,
    OrderItemCatComponent
  ],
})
export class SharedModule {}
