import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit {

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
  }
back(){
this.router.navigate(['/','tabs','settings']);
}
logout(){
      this.authService.logout();
}
}
