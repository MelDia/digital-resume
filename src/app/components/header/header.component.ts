import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true
})
export class HeaderComponent implements AfterViewInit {
  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit() {
    this.animateArrows();
  }

  animateArrows() {
    gsap.fromTo(
      this.elementRef.nativeElement.querySelectorAll('.arrow-right'),
      { opacity: 0, x: -20 },
      { opacity: 1, x: 20, duration: 1, stagger: 0.5, repeat: -1, yoyo: true }
    );
  }
}