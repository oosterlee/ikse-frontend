import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AppService } from '../app.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {
	loggedIn: boolean = this.appService.isLoggedIn();
	role: string = this.appService.getRole();

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver, public appService: AppService, private router: Router) {}

  ngOnInit() {
  	this.setInfo();

  	this.router.events.subscribe(event => {
  		this.setInfo();
  	});
  }

  logout() {
  	this.appService.logout();
	this.setInfo();
  }

  setInfo() {
  	this.loggedIn = this.appService.isLoggedIn();
  	this.role = this.appService.getRole();
  }

}
