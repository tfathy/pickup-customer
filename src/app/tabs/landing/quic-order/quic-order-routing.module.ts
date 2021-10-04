import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuicOrderPage } from './quic-order.page';

const routes: Routes = [
  {
    path: '',
    component: QuicOrderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuicOrderPageRoutingModule {}
