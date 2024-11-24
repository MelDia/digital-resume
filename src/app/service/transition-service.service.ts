import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { gsap } from 'gsap';

@Injectable({
  providedIn: 'root'
})
export class TransitionServiceService {
  public pageOrder = ['home', 'about', 'stack', 'intouch'];

  constructor(private router: Router) {
    // this.initRouterEvents();
  }

  // public initRouterEvents() {
  //   this.router.events.subscribe(event => {
  //     if (event instanceof NavigationEnd) {
  //       this.initScrollAnimation();
  //     }
  //   });
  // }

  // private initScrollAnimation() {
  //   window.addEventListener('wheel', (event) => {
  //     if (event.deltaY > 0) {
  //       console.log("abajo")
  //       this.navigateWithAnimation('next');
  //     } else {
  //       console.log("arriba")
  //       this.navigateWithAnimation('prev');
  //     }
  //   });
  // }

  // private navigateWithAnimation(direction: 'next' | 'prev') {
  //   const currentUrl = this.router.url.split('/').pop() || 'home';
  //   const currentIndex = this.pageOrder.indexOf(currentUrl);

  //   let nextIndex;
  //   if (direction === 'next') {
  //     nextIndex = (currentIndex + 1) % this.pageOrder.length;
  //   } else {
  //     nextIndex = (currentIndex - 1 + this.pageOrder.length) % this.pageOrder.length;
  //   }

  //   const nextUrl = this.pageOrder[nextIndex];

  //   gsap.to('.container', {
  //     y: direction === 'next' ? '-100%' : '100%',
  //     duration: 0.5,
  //     onComplete: () => {
  //       this.router.navigateByUrl(nextUrl);
  //       gsap.from('.container', { y: direction === 'next' ? '100%' : '-100%', duration: 0.5 });
  //     }
  //   });
  // }
}
