import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
  	const token: string = localStorage.getItem("token") || "";
  	if (token !== "") {
  		return next.handle(request.clone({
  			headers: request.headers.set("Authorization", "Bearer " + token)
  		}));
  	}
  	console.log("Request!");
    return next.handle(request);
  }
}