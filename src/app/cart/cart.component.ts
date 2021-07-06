import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Breakpoints, BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { AppService } from '../app.service';
import { Router } from "@angular/router";

interface CartItem {
  id: string;
  amount: number;
};

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
	cols = 3;
	products = [];
	cards: any = [];
	colrows: any = [];
	lastBreakpoint: string = "handset";
	loggedIn: boolean = this.appService.isLoggedIn();
	ordered: boolean = false;

	observer: Observable<BreakpointState> = this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet, Breakpoints.Web]);


	constructor(private breakpointObserver: BreakpointObserver, public appService: AppService, private router: Router) {}

	ngOnInit() {
		console.log(this.cards);

		this.observer.subscribe(val => {
			if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
				console.log("Handset");
				this.cols = 1;
				this.cards = this.getResponsiveCards("handset");
				this.lastBreakpoint = "handset";
			} else if (this.breakpointObserver.isMatched(Breakpoints.Tablet)) {
				console.log("Tablet");
				this.cols = 2;
				this.cards = this.getResponsiveCards("tablet");
				this.lastBreakpoint = "tablet";
			} else if (this.breakpointObserver.isMatched(Breakpoints.Web)) {
				console.log("Web");
				this.cols = 3;
				this.cards = this.getResponsiveCards("web");
				this.lastBreakpoint = "web";
			}
		});

		this.appService.getProducts().subscribe(res => {
			console.log(res);
			this.products = res.items;
			this.colrows = res.colrows;
			this.cards = this.getResponsiveCards(this.lastBreakpoint);
		}, err => {
			console.log(err);
		});
	}

	getResponsiveCards(type: string): Object {
		this.loggedIn = this.appService.isLoggedIn();
		return this.products.filter((item: any) => {
			return this.appService.cartItemExists(item._id);
		}).map((item: any) => {
			let retItem: any = {...item, ...(this.appService.getCartItem(item._id))};
			
			if (this.colrows && this.colrows[type]) {
				if (this.colrows[type][item.id]) {
					retItem.cols = this.colrows[type][item._id].cols;
					retItem.rows = this.colrows[type][item._id].rows;
				}
			}
			return retItem;
		});
	}

	deleteFromCart(id: string): void {
		console.log("Delete", id);
		this.appService.removeFromCart(id);
		this.cards = this.getResponsiveCards(this.lastBreakpoint);
	}

	cartAmountChange(event: any, id: string, val?: number): void {
		console.log("CHANGE", event, id, val);
		this.appService.changeCartItemAmount(id, Number(val ? val : event.target.value));
		this.cards = this.getResponsiveCards(this.lastBreakpoint);
	}

	orderItems(): void {
		console.log("Ordering items...");
		if (!this.appService.isLoggedIn()) {
			this.router.navigate(['/login']);
			return;
		}

		this.cards.forEach((item: any) => {
			this.deleteFromCart(item._id);
		});

		this.ordered = true;
	}
}
