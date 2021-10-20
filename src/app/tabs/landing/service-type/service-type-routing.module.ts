import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServiceTypePage } from './service-type.page';

const routes: Routes = [
  {
    path: '',
    component: ServiceTypePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceTypePageRoutingModule {}
