import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
	error: string = "";
	form: FormGroup = new FormGroup({
		email: new FormControl(''),
		password: new FormControl(''),
	});

	constructor(public appService: AppService, private router: Router) { }

	ngOnInit(): void {
		if (this.appService.isLoggedIn()) this.router.navigate(['/products']);
	}

	login(): void {
		this.error = "";
		const test = this.appService.login(this.form.value.email, this.form.value.password);
		// console.log("LOGIN", this.form);
		// console.log("||||");
		test.subscribe(res => {
			if (res.message) this.error = res.message;
			else this.router.navigate(['/products']);
		}, err => {
			this.error = err.message;
		});
		// console.log(test.subscribe(res => {
		// 	console.log(res);
		// }), (err: any) => {

		// });
		// test.subscribe(console.log);
		// console.log("||||");
	}
 
}
