import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TeamInfoPage } from './team-info.page';

const routes: Routes = [
  {
    path: '',
    component: TeamInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamInfoPageRoutingModule {}
