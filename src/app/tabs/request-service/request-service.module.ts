import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestServicePageRoutingModule } from './request-service-routing.module';

import { RequestServicePage } from './request-service.page';
import { SharedModule } from 'src/app/shared/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RequestServicePageRoutingModule
  ],
  declarations: [RequestServicePage]
})
export class RequestServicePageModule {}
