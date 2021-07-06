import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
	error: string = "";
	form: FormGroup = new FormGroup({
		email: new FormControl(''),
		password: new FormControl(''),
	});

	constructor(public appService: AppService, private router: Router) { }

	ngOnInit(): void {

	}

	register(): void {
		console.log("REGISTER", this.form);
		this.error = "";
		this.appService.register(this.form.value.email, this.form.value.password).subscribe(res => {
			console.log(res);
			if (res.error) return this.error = res.message;
			this.router.navigate(['/login']);
		}, err => {
			if (err) return this.error = err;
			console.log(err);
		});
	}
 
}
