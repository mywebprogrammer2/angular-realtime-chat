import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from 'src/app/auth/services/authService.service';
import { StorageService } from 'src/app/services/storage.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  public user: User | null;

  constructor(private authService: AuthService) {
    this.user = this.authService.getUser();
  }

}
