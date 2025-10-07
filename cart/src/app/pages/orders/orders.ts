import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { Order } from '../../interfaces/order';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.html',
  styleUrl: './orders.css'
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  processingOrders: Set<string> = new Set();

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
      }
    });
  }

  confirmOrder(orderId: string | { $oid: string }): void {
    // Convert orderId to string if it's an object
    const id = typeof orderId === 'string' ? orderId : orderId?.$oid;
    
    console.log('Confirming order with ID:', id);
    
    if (!id) {
      console.error('Invalid order ID');
      return;
    }

    if (this.processingOrders.has(id)) return;
    
    this.processingOrders.add(id);
    this.orderService.confirmOrder(id).subscribe({
      next: (response) => {
        console.log('Order confirmed successfully:', response);
        this.loadOrders(); // Reload orders to get updated status
        this.processingOrders.delete(id);
      },
      error: (error) => {
        console.error('Error confirming order:', error);
        this.processingOrders.delete(id);
      }
    });
  }
}