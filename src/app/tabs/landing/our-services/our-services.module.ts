import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OurServicesPageRoutingModule } from './our-services-routing.module';

import { OurServicesPage } from './our-services.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OurServicesPageRoutingModule
  ],
  declarations: [OurServicesPage]
})
export class OurServicesPageModule {}
