import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../shared/api.service';
import { AuthService } from '../shared/auth.service';
import { RestaurentData } from './restaurent.model';

@Component({
  selector: 'app-restaurent-dash',
  templateUrl: './restaurent-dash.component.html',
  styleUrls: ['./restaurent-dash.component.css']
})
export class RestaurentDashComponent implements OnInit {
  loggedInUser: any = null;
  role: string = 'customer';

  // Staff
  formValue!: FormGroup;
  restaurentModelObj: RestaurentData = new RestaurentData();
  allRestaurentData: any[] = [];
  showAdd: boolean = false;
  showBtn: boolean = false;

  // Menu
  menuForm!: FormGroup;
  allMenus: any[] = [];
  selectedRestaurantId: number | null = null;
  editingMenuId: number | null = null;

  // Orders
  allOrders: any[] = [];
  orderStatusOptions = ['pending', 'preparing', 'ready', 'out-for-delivery', 'delivered'];

  // Customer
  restaurants: any[] = [];
  selectedRestaurant: any = null;
  menuItems: any[] = [];
  cart: any[] = [];
  orderType: 'dine-in' | 'delivery' = 'dine-in';
  deliveryAddress = '';
  orderPlaced = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.auth.getLoggedInUser();
    if (!user) { this.router.navigate(['/login']); return; }
    // Force re-login if session has no role (stale session)
    if (!user.role) {
      this.auth.logout();
      this.router.navigate(['/login']);
      return;
    }
    this.loggedInUser = user;
    this.role = user.role;

    this.formValue = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      address: ['', Validators.required],
      services: [''],
      cuisine: [''],
      rating: [0]
    });

    this.menuForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1)]],
      category: ['', Validators.required],
      available: [true]
    });

    this.loadRoleData();
  }

  loadRoleData(): void {
    if (this.role === 'staff') {
      this.api.getRestaurent().subscribe(res => this.allRestaurentData = res);
      this.api.getOrders().subscribe(res => this.allOrders = res);
      this.api.getAllMenus().subscribe(res => this.allMenus = res);
    } else if (this.role === 'kitchen') {
      this.api.getOrders().subscribe(res =>
        this.allOrders = res.filter((o: any) => ['pending', 'preparing'].includes(o.status))
      );
    } else if (this.role === 'driver') {
      this.api.getDeliveryOrders().subscribe(res =>
        this.allOrders = res.filter((o: any) => ['ready', 'out-for-delivery'].includes(o.status))
      );
    } else {
      this.api.getRestaurent().subscribe(res => this.restaurants = res);
    }
  }

  // ── Staff: Restaurant CRUD ──────────────────────────────────────────────────
  clickAddResto(): void {
    this.formValue.reset({ rating: 0 });
    this.showAdd = true; this.showBtn = false;
    (window as any).bootstrap.Modal.getOrCreateInstance(document.getElementById('restoModal')).show();
  }

  addRestaurent(): void {
    if (this.formValue.invalid) { this.formValue.markAllAsTouched(); return; }
    Object.assign(this.restaurentModelObj, this.formValue.value);
    this.api.postRestaurent(this.restaurentModelObj).subscribe(() => {
      this.closeModal('restoModal');
      this.api.getRestaurent().subscribe(res => this.allRestaurentData = res);
    });
  }

  onEditResto(data: any): void {
    this.showAdd = false; this.showBtn = true;
    this.restaurentModelObj.id = data.id;
    this.formValue.patchValue(data);
    (window as any).bootstrap.Modal.getOrCreateInstance(document.getElementById('restoModal')).show();
  }

  updateResto(): void {
    Object.assign(this.restaurentModelObj, this.formValue.value);
    this.api.updateRestaurant(this.restaurentModelObj.id, this.restaurentModelObj).subscribe(() => {
      this.closeModal('restoModal');
      this.api.getRestaurent().subscribe(res => this.allRestaurentData = res);
    });
  }

  deleteResto(id: number): void {
    if (!confirm('Delete this restaurant?')) return;
    this.api.deleteRestaurant(id).subscribe(() =>
      this.api.getRestaurent().subscribe(res => this.allRestaurentData = res)
    );
  }

  // ── Staff: Menu Management ──────────────────────────────────────────────────
  openMenuManager(restaurantId: number): void {
    this.selectedRestaurantId = restaurantId;
    this.editingMenuId = null;
    this.menuForm.reset({ available: true });
    this.api.getMenuByRestaurant(restaurantId).subscribe(res => this.allMenus = res);
    (window as any).bootstrap.Modal.getOrCreateInstance(document.getElementById('menuModal')).show();
  }

  saveMenuItem(): void {
    if (this.menuForm.invalid) { this.menuForm.markAllAsTouched(); return; }
    const payload = { ...this.menuForm.value, restaurantId: this.selectedRestaurantId };
    const req = this.editingMenuId
      ? this.api.updateMenuItem(this.editingMenuId, payload)
      : this.api.addMenuItem(payload);
    req.subscribe(() => {
      this.editingMenuId = null;
      this.menuForm.reset({ available: true });
      this.api.getMenuByRestaurant(this.selectedRestaurantId!).subscribe(res => this.allMenus = res);
    });
  }

  editMenuItem(item: any): void {
    this.editingMenuId = item.id;
    this.menuForm.patchValue(item);
  }

  deleteMenuItem(id: number): void {
    this.api.deleteMenuItem(id).subscribe(() =>
      this.api.getMenuByRestaurant(this.selectedRestaurantId!).subscribe(res => this.allMenus = res)
    );
  }

  // ── Orders: Staff / Kitchen / Driver ───────────────────────────────────────
  updateStatus(order: any, status: string): void {
    this.api.updateOrderStatus(order.id, { status }).subscribe(() => {
      order.status = status;
      if (this.role === 'kitchen') this.allOrders = this.allOrders.filter(o => !['ready','delivered'].includes(o.status));
      if (this.role === 'driver') this.allOrders = this.allOrders.filter(o => o.status !== 'delivered');
    });
  }

  getStatusClass(status: string): string {
    const map: any = { pending: 'warning', preparing: 'info', ready: 'primary', 'out-for-delivery': 'secondary', delivered: 'success' };
    return map[status] || 'light';
  }

  // ── Customer: Browse & Order ────────────────────────────────────────────────
  selectRestaurant(r: any): void {
    this.selectedRestaurant = r;
    this.cart = [];
    this.orderPlaced = false;
    this.loadMenu(r.id);
  }

  loadMenu(restaurantId: number): void {
    this.api.getMenuByRestaurant(restaurantId).subscribe(res => this.menuItems = res);
  }

  addToCart(item: any): void {
    const existing = this.cart.find(c => c.id === item.id);
    if (existing) existing.qty++;
    else this.cart.push({ ...item, qty: 1 });
  }

  removeFromCart(item: any): void {
    const existing = this.cart.find(c => c.id === item.id);
    if (existing && existing.qty > 1) existing.qty--;
    else this.cart = this.cart.filter(c => c.id !== item.id);
  }

  getCartQty(item: any): number {
    return this.cart.find(c => c.id === item.id)?.qty || 0;
  }

  get cartTotal(): number {
    return this.cart.reduce((sum, c) => sum + c.price * c.qty, 0);
  }

  placeOrder(): void {
    if (!this.cart.length) return;
    if (this.orderType === 'delivery' && !this.deliveryAddress.trim()) {
      alert('Please enter delivery address.'); return;
    }
    const order = {
      restaurantId: this.selectedRestaurant.id,
      restaurantName: this.selectedRestaurant.name,
      customerName: this.loggedInUser.name,
      items: this.cart.map(c => ({ name: c.name, price: c.price, qty: c.qty })),
      total: this.cartTotal,
      type: this.orderType,
      status: 'pending',
      address: this.deliveryAddress,
      createdAt: new Date().toISOString()
    };
    this.api.placeOrder(order).subscribe(() => {
      this.orderPlaced = true;
      this.cart = [];
    });
  }

  closeModal(id: string): void {
    (window as any).bootstrap.Modal.getOrCreateInstance(document.getElementById(id)).hide();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
