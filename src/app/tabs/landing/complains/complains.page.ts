import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-complains',
  templateUrl: './complains.page.html',
  styleUrls: ['./complains.page.scss'],
})
export class ComplainsPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  back(){
    this.router.navigate(['/','tabs','landing']);
  }

}
