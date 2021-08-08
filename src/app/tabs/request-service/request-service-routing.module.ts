import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestServicePage } from './request-service.page';

const routes: Routes = [
  {
    path: '',
    component: RequestServicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestServicePageRoutingModule {}
