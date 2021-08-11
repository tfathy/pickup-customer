import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  appDirection = 'rtl';
  lang = 'ar';
  constructor(private translate: TranslateService) {
    this.setLanguage('ar');
  }
  setLanguage(lang: string) {
    this.translate.setDefaultLang(lang);
    this.translate.use(lang);
  }

  change2Arabic() {
    this.setLanguage('ar');
    this.appDirection = 'rtl';
    this.lang='ar';
  }
  change2English() {
    this.setLanguage('en');
    this.appDirection = 'ltr';
    this.lang='en';
  }
}
