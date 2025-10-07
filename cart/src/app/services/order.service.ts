import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Order } from '../interfaces/order';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { OrderConfirmResponse } from '../interfaces/notification';

interface CreateOrderItem {
  id: string;
  productName: string;
  price: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'http://localhost:3001/api/v1.0';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private notificationService: NotificationService
  ) { }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/orders`);
  }

  createOrder(items: CreateOrderItem[]): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/orders/store`, items)
      .pipe(
        tap(order => {
          this.notificationService.addNotification('Order created successfully');
        })
      );
  }

  confirmOrder(orderId: string): Observable<OrderConfirmResponse> {
    console.log('Service: Confirming order with ID:', orderId);
    if (!orderId) {
      throw new Error('Order ID is required');
    }
    
    return this.http.put<OrderConfirmResponse>(`${this.baseUrl}/orders/${orderId}/confirm`, {})
      .pipe(
        tap(response => {
          console.log('Service: Order confirmed successfully:', response);
          this.notificationService.addNotification(response.message);
        })
      );
  }
}