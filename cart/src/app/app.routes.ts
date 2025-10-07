import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Carts } from './pages/carts/carts';
import { OrdersComponent } from './pages/orders/orders';
import { SigninComponent } from './pages/signin/signin';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {path: "", component: Home},
    {path: "cart", component: Carts},
    {path: "orders", component: OrdersComponent, canActivate: [authGuard]},
    {path: "signin", component: SigninComponent},
];
