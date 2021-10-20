import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VclSizePageRoutingModule } from './vcl-size-routing.module';

import { VclSizePage } from './vcl-size.page';
import { SharedModule } from 'src/app/shared/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    VclSizePageRoutingModule
  ],
  declarations: [VclSizePage]
})
export class VclSizePageModule {}
