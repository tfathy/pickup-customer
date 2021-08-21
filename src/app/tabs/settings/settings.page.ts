import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/shared/services/auth.service';
import { LangService } from 'src/app/shared/services/lang.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor( private router: Router,public langService: LangService, private authService: AuthService) { }

  ngOnInit() {
  }

  change2Arabic() {
   this.langService.change2Arabic();
  }
  change2English() {
  this.langService.change2English();
  }
  logout(){
    this.authService.logout();
  }
}
