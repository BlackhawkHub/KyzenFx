import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from "@angular/common/http";
import { AuthService } from "./../services/auth.service";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Injectable()

export class myInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthService,
        private router: Router,
        private toast: ToastrService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        const authToken = this.authService.getToken();
        
        if(authToken){
            req = req.clone({
                setHeaders: {
                    Authorization: "Bearer " + authToken
                }
            });
            return next.handle(req).pipe(
                catchError((error: HttpErrorResponse) => {
                    if(error.status == 401){
                        this.toast.error('Session Expired.');
                        this.router.navigateByUrl('/login');
                    }

                    return throwError(error);
                })
            );
        }
        else{
            return next.handle(req);
        }
    }
}