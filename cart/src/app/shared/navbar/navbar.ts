import { Component } from '@angular/core';
import { Cart } from "../cart/cart";
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { NotificationsComponent } from '../notifications/notifications';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [Cart, RouterLink, CommonModule, NotificationsComponent],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  onSignOut(): void {
    this.authService.logout();
    this.router.navigate(['/signin']);
  }
}
