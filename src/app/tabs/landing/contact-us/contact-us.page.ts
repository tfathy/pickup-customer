import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}
  back() {
    this.router.navigate(['/', 'tabs', 'landing']);
  }
}
