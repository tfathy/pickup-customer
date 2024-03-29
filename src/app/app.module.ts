/* eslint-disable prefer-arrow/prefer-arrow-functions */
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared/shared.module';
import { ServiceWorkerModule } from '@angular/service-worker';

import { AppInterceptor } from './shared/shared/app-Interceptor';

// import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
// import { getAuth, provideAuth } from '@angular/fire/auth';
// import { getFirestore, provideFirestore } from '@angular/fire/firestore';
// import { getStorage, provideStorage } from '@angular/fire/storage';
// import { getAnalytics, provideAnalytics } from '@angular/fire/analytics';

import { environment } from 'src/environments/environment';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
// eslint-disable-next-line @typescript-eslint/naming-convention
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
/*export function appInitializer() {
  return () => initializeApp(environment.firebaseConfig);
}*/

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
  /*  provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
    provideAnalytics(() => getAnalytics()),*/
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    SharedModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true },
   // { provide: APP_INITIALIZER, useFactory: () => appInitializer, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
