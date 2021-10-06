import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ComplainsPage } from './complains.page';

const routes: Routes = [
  {
    path: '',
    component: ComplainsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComplainsPageRoutingModule {}
