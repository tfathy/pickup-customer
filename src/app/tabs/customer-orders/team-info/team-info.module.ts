import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TeamInfoPageRoutingModule } from './team-info-routing.module';

import { TeamInfoPage } from './team-info.page';
import { SharedModule } from 'src/app/shared/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    TeamInfoPageRoutingModule
  ],
  declarations: [TeamInfoPage]
})
export class TeamInfoPageModule {}
