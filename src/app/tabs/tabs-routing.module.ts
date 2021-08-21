import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../shared/auth.guard';

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
          ), canLoad:[AuthGuard]
      },
      {
        path: 'settings',
        loadChildren: () => import('./settings/settings.module').then( m => m.SettingsPageModule)
      },
    ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
