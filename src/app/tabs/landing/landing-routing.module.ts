import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from 'src/app/shared/auth.guard';

import { LandingPage } from './landing.page';

const routes: Routes = [
  {
    path: '',
    component: LandingPage
  },
  {
    path: 'quic-order',
    loadChildren: () => import('./quic-order/quic-order.module').then( m => m.QuicOrderPageModule),canLoad:[AuthGuard]
  },
  {
    path: 'offers',
    loadChildren: () => import('./offers/offers.module').then( m => m.OffersPageModule)
  },
  {
    path: 'our-services',
    loadChildren: () => import('./our-services/our-services.module').then( m => m.OurServicesPageModule)
  },
  {
    path: 'contact-us',
    loadChildren: () => import('./contact-us/contact-us.module').then( m => m.ContactUsPageModule)
  },
  {
    path: 'suggestions',
    loadChildren: () => import('./suggestions/suggestions.module').then( m => m.SuggestionsPageModule)
  },
  {
    path: 'complains',
    loadChildren: () => import('./complains/complains.module').then( m => m.ComplainsPageModule)
  },  {
    path: 'service-type',
    loadChildren: () => import('./service-type/service-type.module').then( m => m.ServiceTypePageModule)
  },
  {
    path: 'vcl-size',
    loadChildren: () => import('./vcl-size/vcl-size.module').then( m => m.VclSizePageModule)
  },
  {
    path: 'luggage',
    loadChildren: () => import('./luggage/luggage.module').then( m => m.LuggagePageModule)
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingPageRoutingModule {}
