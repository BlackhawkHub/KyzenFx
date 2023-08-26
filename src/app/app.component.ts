import { Component, OnInit, Inject, Renderer2, ElementRef, ViewChild, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
//import { Subscription } from 'rxjs/Subscription';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';
//import 'rxjs/add/operator/filter';
import { filter } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { BnNgIdleService } from 'bn-ng-idle';
import { AuthService } from './services/auth.service';
import { Toast, ToastrService } from 'ngx-toastr';
declare var $: any;

var didScroll;
var lastScrollTop = 0;
var delta = 5;
var navbarHeight = 0;

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    private _router: Subscription;
    title = 'remit-client-ui';
    warned: boolean;
    timeout: number = 300;

    constructor(
        private renderer: Renderer2,
        private router: Router,
        @Inject(DOCUMENT,)
        private document: any,
        private element: ElementRef,
        public location: Location,
        private bnIdle: BnNgIdleService,
        private authService: AuthService,
        private toast: ToastrService
    ) {
        if(authService.isLoggedIn){
            this.bnIdle.startWatching(this.timeout).subscribe((res) => {
                if (res) {
                    if(!this.warned){
                        console.log("show warning");
                        $('#timeoutWarning').modal('show');
                        this.warned = true;
                        this.timeout = 30;
                        this.bnIdle.stopTimer();
                        this.bnIdle.startWatching(this.timeout);
                    }
                    else if(this.warned){
                        this.bnIdle.stopTimer();
                        this.userLogout();
                    }
                }
            });
        }
    }

    resetWarning(){
        this.warned = false;
        this.timeout = 300;
        this.bnIdle.stopTimer();
        this.bnIdle.startWatching(this.timeout);
    }

    @HostListener('window:scroll', ['$event'])
    hasScrolled() {

        var st = window.pageYOffset;
        // Make sure they scroll more than delta
        if (Math.abs(lastScrollTop - st) <= delta)
            return;

        var navbar = document.getElementsByTagName('nav')[0];

        // If they scrolled down and are past the navbar, add class .headroom--unpinned.
        // This is necessary so you never see what is "behind" the navbar.
        if (st > lastScrollTop && st > navbarHeight) {
            // Scroll Down
            if (navbar.classList.contains('headroom--pinned')) {
                navbar.classList.remove('headroom--pinned');
                navbar.classList.add('headroom--unpinned');
            }
            // $('.navbar.headroom--pinned').removeClass('headroom--pinned').addClass('headroom--unpinned');
        } else {
            // Scroll Up
            //  $(window).height()
            if (st + window.innerHeight < document.body.scrollHeight) {
                // $('.navbar.headroom--unpinned').removeClass('headroom--unpinned').addClass('headroom--pinned');
                if (navbar.classList.contains('headroom--unpinned')) {
                    navbar.classList.remove('headroom--unpinned');
                    navbar.classList.add('headroom--pinned');
                }
            }
        }

        lastScrollTop = st;
    };

    ngOnInit() {
        var navbar: HTMLElement = this.element.nativeElement.children[0].children[0];
      //  this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
            if (window.outerWidth > 991) {
                window.document.children[0].scrollTop = 0;
            } else {
                window.document.activeElement.scrollTop = 0;
            }
            this.renderer.listen('window', 'scroll', (event) => {
                const number = window.scrollY;
                if (number > 150 || window.pageYOffset > 150) {
                    // add logic
                    navbar.classList.add('headroom--not-top');
                } else {
                    // remove logic
                    navbar.classList.remove('headroom--not-top');
                }
            });
       // });

        this.hasScrolled();

        $('.parent-dropdown').hover(function(evt) {
            evt.preventDefault();
            var openClass = 'w--open';
            if (evt.type == 'mouseenter') { 
                $(this).find('.w-dropdown-toggle').addClass(openClass); 
                $(this).find('.dd-list').addClass(openClass);
              
            }
            else if (evt.type == 'mouseleave') { 
                $(this).find('.w-dropdown-toggle').removeClass(openClass); 
                $(this).find('.dd-list').removeClass(openClass);
             
            }
        }); 
    }

    userLogout(){
        this.authService.doLogout();
    }
}
