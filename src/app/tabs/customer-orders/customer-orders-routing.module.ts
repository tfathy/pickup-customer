import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerOrdersPage } from './customer-orders.page';

const routes: Routes = [
  {
    path: '',
    component: CustomerOrdersPage
  },
  {
    path: 'team-info/:id',
    loadChildren: () => import('./team-info/team-info.module').then( m => m.TeamInfoPageModule)
  },
  {
    path: 'track-order/:orderId',
    loadChildren: () => import('./track-order/track-order.module').then( m => m.TrackOrderPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerOrdersPageRoutingModule {}
