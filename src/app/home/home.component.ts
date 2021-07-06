import { Component } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Breakpoints, BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { AppService } from '../app.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface CartItem {
  id: string;
  amount: number;
};

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.css']
})
export class HomeComponent {
	cols = 3;
	products = [];
	cards: any = [];
	colrows: any = [];
	lastBreakpoint: string = "handset";
	/** Based on the screen size, switch from standard to one column per row */

	observer: Observable<BreakpointState> = this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet, Breakpoints.Web]);

	// cards = this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet, Breakpoints.Web]).pipe(
	//   map(({ matches, breakpoints }) => {

	//     if (this.breakpointObserver.isMatched(Breakpoints.Handset)) {
	//       console.log("Handset");
	//       this.cols = 1;
		
	//     } else if (this.breakpointObserver.isMatched(Breakpoints.Tablet)) {
	//       console.log("Tablet");
	//       this.cols = 2;
		
	//     } else if (this.breakpointObserver.isMatched(Breakpoints.Web)) {
	//       console.log("Web");
	//       this.cols = 3;
		
	//     }
	//     console.log(matches, breakpoints, this.cols);

	//     return this.products;
	//   })
	// );

	constructor(private breakpointObserver: BreakpointObserver, public appService: AppService, private _snackBar: MatSnackBar) {}

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
		return this.products.map((item: any) => {
			let retItem: any = {...item};
			
			if (this.colrows && this.colrows[type]) {
				if (this.colrows[type][item.id]) {
					retItem.cols = this.colrows[type][item.id].cols;
					retItem.rows = this.colrows[type][item.id].rows;
				}
			}
			return retItem;
		});
	}

	addItemToCart(id: string): void {
		this.openSnackBar("Added item to cart", "Close", 1500);
		if (this.appService.cartItemExists(id))  {
			const cartItem: CartItem = this.appService.getCartItem(id);
			this.appService.changeCartItemAmount(id, cartItem.amount+1);
			return;
		}

		const newItem: CartItem = { id, amount: 1 };
		this.appService.addToCart(newItem);
	}

	openSnackBar(message: string, action: string, duration?: number) {
		this._snackBar.open(message, action, duration ? { duration } : {});
	}


}
