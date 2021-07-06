import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppService } from '../../app.service';
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
	id: string = "";
	error: string = "";
	form: FormGroup = new FormGroup({
		title: new FormControl('', [Validators.required]),
		price: new FormControl('', [Validators.required]),
		image: new FormControl(''),
		description: new FormControl('', [Validators.required]),
	});

	constructor(private route: ActivatedRoute, public appService: AppService, private router: Router) { }

	ngOnInit(): void {
		this.route.params.subscribe(params => {
			this.id = params["id"] || "";
		});

		if (this.id !== '') {
			this.appService.getProduct(this.id).subscribe(res => {
				if (res.error) return this.error = res.message;
				this.form.get('title')!.setValue(res.title);
				this.form.get('price')!.setValue(res.price);
				this.form.get('image')!.setValue(res.image);
				this.form.get('description')!.setValue(res.description);
				console.log(res);
			}, err => {
				if (err) return this.error = err.message;
				console.error(err);
			});
		}

		console.log(this.form);
	}

	add(): void {
		this.error = "";
		if (this.form.status == "INVALID") return;
		console.log("ADD PRODUCT");
		this.appService.addProduct(this.form.value.title, this.form.value.price, this.form.value.image, this.form.value.description).subscribe(res => {
			console.log("GOT RESULT", res);
			if (res.error) return this.error = res.message;
			else return this.router.navigate(['/manage/products']);
		});
	}

	edit(): void {
		this.error = "";
		if (this.form.status == "INVALID") return;
		console.log(this.form);
		console.log("EDIT PRODUCT");
		this.appService.editProduct(this.id, this.form.value.title, this.form.value.price, this.form.value.image, this.form.value.description).subscribe(res => {
			console.log("GOT RESULT", res);
			if (res.error) return this.error = res.message;
			else return this.router.navigate(['/manage/products']);
		});
	}

	getErrorMessage(field: string) {
		return this.form.get(field)!.hasError('required') ? "You must enter a value" : "";
	}

	// this.id == "" is new product
	// this.id == "someid" is edit product

}
