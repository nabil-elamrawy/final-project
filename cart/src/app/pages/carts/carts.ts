import { Component, Query } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-carts',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carts.html',
  styleUrl: './carts.css'
})
export class Carts {
  isCreatingOrder = false;
  errorMessage = '';

  constructor(
    protected cart: CartService,
    private orderService: OrderService,
    private router: Router,
    private authService: AuthService
  ) {}

  remove(id: string) {
    this.cart.removeItem(id);
  }

  increase(id: string, quantity: number) {
    this.cart.updateQuantity(id, quantity + 1);
  }

  decrease(id: string, quantity: number) {
    if(quantity <= 1) return;
    this.cart.updateQuantity(id, quantity - 1);
  }

  createOrder() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/signin']);
      return;
    }

    const currentItems = this.cart.items();
    if (currentItems.length === 0) {
      this.errorMessage = 'Your cart is empty';
      return;
    }

    this.isCreatingOrder = true;
    this.errorMessage = '';

    const orderItems = currentItems.map(item => ({
      id: item.id,
      productName: item.name,
      price: item.price,
      quantity: item.quantity
    }));

    this.orderService.createOrder(orderItems).subscribe({
      next: () => {
        this.isCreatingOrder = false;
        this.cart.clearCart();
        this.router.navigate(['/orders']);
      },
      error: (error) => {
        this.isCreatingOrder = false;
        this.errorMessage = error.error?.message || 'Failed to create order. Please try again.';
      }
    });
  }

}
