import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/tabs/request-service',
    pathMatch: 'full',
  },
  {
    path: '',
    component: TabsPage,
    children: [
      { path: '', redirectTo: '/tabs/request-service', pathMatch: 'full' },

      {
        path: 'request-service',
        loadChildren: () =>
          import('./request-service/request-service.module').then(
            (m) => m.RequestServicePageModule
          ),
      },
      {
        path: 'customer-orders',
        loadChildren: () =>
          import('./customer-orders/customer-orders.module').then(
            (m) => m.CustomerOrdersPageModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
