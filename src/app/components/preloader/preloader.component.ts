import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { gsap } from 'gsap';

@Component({
  selector: 'app-preloader',
  templateUrl: './preloader.component.html',
  styleUrls: ['./preloader.component.scss']
})
export class PreloaderComponent implements AfterViewInit {
  @ViewChild('loadingTextWrapper', { static: false }) loadingTextWrapper!: ElementRef<HTMLInputElement>;
  @ViewChild('preloaderWrapper', { static: false }) preloaderWrapper!: ElementRef<HTMLInputElement>;

  public displayCounter: number = 0;
  public intervalId: any;

  public loadingText: string = 'Loading';
  public dotCount: number = 0;

  ngAfterViewInit(): void {
    this.intervalId = setInterval(() => {

      this.dotAnimation();

      if (this.dotCount === 3) {
        clearInterval(this.intervalId);

        setTimeout(() => {
          this.hidePreloader();
        }, 500)
      }
    }, 500)
  }

  public dotAnimation(): void {
    if (this.dotCount < 3) {
      const dot = document.createElement('span');
      dot.textContent = '.';
      dot.style.opacity = '0';

      this.loadingTextWrapper.nativeElement.appendChild(dot);

      gsap.to(dot, { opacity: 1, duration: 0.5 });

      this.dotCount++
    }

  }

  public hidePreloader() {
    gsap.to(this.preloaderWrapper.nativeElement, {
      duration: 3,
      y: '-100%',
      ease: 'power3.out',
    })
  }

}
