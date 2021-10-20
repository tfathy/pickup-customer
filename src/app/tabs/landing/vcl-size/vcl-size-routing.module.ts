import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VclSizePage } from './vcl-size.page';

const routes: Routes = [
  {
    path: '',
    component: VclSizePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VclSizePageRoutingModule {}
