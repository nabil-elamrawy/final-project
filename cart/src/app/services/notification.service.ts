import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notification } from '../interfaces/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notifications.asObservable();

  private unreadCount = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCount.asObservable();

  constructor() {
    this.loadNotifications();
  }

  private loadNotifications() {
    const stored = localStorage.getItem('notifications');
    if (stored) {
      try {
        const notifications = JSON.parse(stored);
        this.notifications.next(notifications);
        this.updateUnreadCount(notifications);
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }
  }

  private saveNotifications(notifications: Notification[]) {
    localStorage.setItem('notifications', JSON.stringify(notifications));
    this.notifications.next(notifications);
    this.updateUnreadCount(notifications);
  }

  private updateUnreadCount(notifications: Notification[]) {
    const count = notifications.filter(n => !n.isRead).length;
    this.unreadCount.next(count);
  }

  addNotification(message: string) {
    const notification: Notification = {
      id: Date.now().toString(),
      message,
      isRead: false,
      createdAt: new Date()
    };

    const current = this.notifications.value;
    this.saveNotifications([notification, ...current]);
  }

  markAsRead(id: string) {
    const current = this.notifications.value;
    const updated = current.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    );
    this.saveNotifications(updated);
  }

  markAllAsRead() {
    const current = this.notifications.value;
    const updated = current.map(n => ({ ...n, isRead: true }));
    this.saveNotifications(updated);
  }

  clearAll() {
    this.saveNotifications([]);
  }
}