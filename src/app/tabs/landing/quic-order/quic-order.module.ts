import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuicOrderPageRoutingModule } from './quic-order-routing.module';

import { QuicOrderPage } from './quic-order.page';
import { SharedModule } from 'src/app/shared/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    QuicOrderPageRoutingModule
  ],
  declarations: [QuicOrderPage]
})
export class QuicOrderPageModule {}
