import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CapHttpService } from 'src/app/shared/services/cap-http.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {
  top = [];
  middle = [];
  bottom = [];
  catSlideOpts = {
    slidesPerView: 3.5,
    spaceBetween: 10,
    slidesOffsetBefore: 11,
    freeMode: true
  };

  highlightSlideOpts =  {
    slidesPerView: 1.05,
    spaceBetween: 10,
    centeredSlides: true,
    loop: true
  };

  featuredSlideOpts = {
    slidesPerView: 1.2,
    spaceBetween: 10,
    freeMode: true
  };

  showLocationDetail = false;
  constructor(private capHttp: CapHttpService) { }

  ngOnInit() {
    this.capHttp.doGEt('https://customer.pickup-sa.net/data/landing.json').subscribe((res: any) => {
      this.top = res.data.top;
      this.middle = res.data.middle;
      this.bottom = res.data.bottom;
    });
  }
  doRefresh(event) {
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
  onScroll(ev) {
    const offset = ev.detail.scrollTop;
    this.showLocationDetail = offset > 40;
  }
}
