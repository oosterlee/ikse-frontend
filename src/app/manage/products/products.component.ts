import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';

interface ProductItem {
  title: string;
  price: number;
  image: number;
  description: string;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
	displayedColumns: string[] = ["title", "price", "image", "description", "actions"];
	dataSource: ProductItem[] = [];

	constructor(public appService: AppService) { }

	ngOnInit(): void {
		this.appService.getProducts().subscribe(res => {
			console.log(res);
			this.dataSource = res.items;
		}, err => {
			console.log(err);
		});
	}

	deleteProduct(id: string): void {
		this.appService.deleteProduct(id).subscribe(res => {
			this.dataSource = res.items;
		}, err => {
			console.log(err);
		});
	}

}
