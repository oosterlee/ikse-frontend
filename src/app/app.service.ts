import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, shareReplay } from 'rxjs/operators';
// import 'rxjs/add/operator/shareReplay';

interface CartItem {
  id: string;
  amount: number;
};

@Injectable({
  providedIn: 'root'
})
export class AppService {
	private token: string = "";
	private cart: Array<CartItem> = [];


	constructor(public httpClient:HttpClient) {
		console.log("CONSTRUCT");
	}

	getProducts(): Observable<any> {
		return this.httpClient.get("http://localhost:3000/api/products");
	}

	getProduct(id: string): Observable<any> {
		return this.httpClient.get("http://localhost:3000/api/product/" + id);
	}

	deleteProduct(id: string): Observable<any> {
		console.log("SEND DELETE");
		return this.httpClient.delete("http://localhost:3000/api/product/" + id);
	}

	addProduct(title: string, price: number, image: string, description: string): Observable<any> {
		return this.httpClient.post("http://localhost:3000/api/product", { title, price, image, description });
	}

	editProduct(id: string, title: string, price: number, image: string, description: string): Observable<any> {
		return this.httpClient.put("http://localhost:3000/api/product/" + id, { id, title, price, image, description });
	}

	login(email: string, password: string): Observable<any> {
		return this.httpClient.post<{
			email: string,
			password: string,
			message?: string,
			token?: string,
			role?: string,
		}>("http://localhost:3000/login", {email, password}).pipe(tap(res => this.setSession(res)), shareReplay(1))
    }

	private setSession(authResult: any) {
		if (authResult.message) return;
		localStorage.setItem('role', authResult.role);
		localStorage.setItem('email', authResult.email);
        localStorage.setItem('token', authResult.token);
    }

    logout() {
        localStorage.removeItem("role");
        localStorage.removeItem("email");
        localStorage.removeItem("token");
    }

	register(email: string, password: string): Observable<any> {
		return this.httpClient.post<{
			email: string,
			password: string,
			message?: string,
			error?: boolean,
		}>("http://localhost:3000/register", { email, password });
	}

	isLoggedIn(): boolean {
		// TODO: Check if expires_at is correct
		return localStorage.getItem("token") !== null;
	}

	getRole(): string {
		return localStorage.getItem('role') || "";
	}

	getEmail(): string {
		return localStorage.getItem('email') || "";
	}


	private getCartItemIndex(id: string): number {
		for (let i = 0; i < this.cart.length; i++) {
			if (this.cart[i].id === id) return i;
		}

		return -1;
	}

	cartItemExists(id: string): boolean {
		return this.getCartItemIndex(id) !== -1;
	}

	addToCart(item: CartItem): void {
		if (!this.cartItemExists(item.id)) this.cart.push(item);
	}

	removeFromCart(id: string): void {
		const index = this.getCartItemIndex(id);
		if (index >= 0) this.cart.splice(index, 1);
		console.log("removeFromCart", index, this.cart);
	}

	changeCartItemAmount(id: string, amount: number): void {
		const index = this.getCartItemIndex(id);
		if (index >= 0) this.cart[index].amount = amount <= 0 ? 1 : amount;
	}

	getCartItem(id: string): CartItem {
		return this.cart[this.getCartItemIndex(id)];
	}

	getCartItems(): CartItem[] {
		return this.cart;
	}
}
