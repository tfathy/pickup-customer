import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComplainsPageRoutingModule } from './complains-routing.module';

import { ComplainsPage } from './complains.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComplainsPageRoutingModule
  ],
  declarations: [ComplainsPage]
})
export class ComplainsPageModule {}
