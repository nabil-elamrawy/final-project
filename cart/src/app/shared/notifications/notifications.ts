import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class NotificationsComponent {
  showNotifications = false;

  constructor(public notificationService: NotificationService) {}

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.notificationService.markAllAsRead();
    }
  }

  markAsRead(id: string) {
    this.notificationService.markAsRead(id);
  }

  clearAll() {
    this.notificationService.clearAll();
    this.showNotifications = false;
  }
}