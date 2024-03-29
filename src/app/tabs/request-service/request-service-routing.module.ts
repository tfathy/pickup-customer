import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/shared/auth.guard';

import { RequestServicePage } from './request-service.page';

const routes: Routes = [
  {
    path: '',
    component: RequestServicePage, canLoad: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestServicePageRoutingModule {}
