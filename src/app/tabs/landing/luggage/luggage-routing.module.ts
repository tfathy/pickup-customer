import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LuggagePage } from './luggage.page';

const routes: Routes = [
  {
    path: '',
    component: LuggagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LuggagePageRoutingModule {}
