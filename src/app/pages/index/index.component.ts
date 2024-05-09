import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, Inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  @ViewChild('firstContainer',
    { static: true }) firstContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('textTitleOne',
    { static: true }) textTitleOne!: ElementRef<HTMLDivElement>;
  @ViewChild('textTitleTwo',
    { static: true }) textTitleTwo!: ElementRef<HTMLDivElement>;

  @ViewChild('secondContainer',
    { static: true }) secondContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('textTitleThree',
    { static: true }) textTitleThree!: ElementRef<HTMLDivElement>;
  @ViewChild('textTitleFour',
    { static: true }) textTitleFour!: ElementRef<HTMLDivElement>;
  @ViewChild('textTitleFive',
    { static: true }) textTitleFive!: ElementRef<HTMLDivElement>;

  @ViewChild('thirdContainer',
    { static: true }) thirdContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('marqueeContainer',
    { static: true }) marqueeContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('first__marquee',
    { static: true }) firstMarquee!: ElementRef<HTMLDivElement>;
  @ViewChild('second__marquee',
    { static: true }) secondMarquee!: ElementRef<HTMLDivElement>;


  constructor(
    @Inject(DOCUMENT) private document: Document,
    private elRef: ElementRef
  ) { }

  ngOnInit() {

    // gsap.set([this.secondContainer.nativeElement, this.thirdContainer.nativeElement], { y: '100%' });
    // setTimeout(() => {
    // this.initialAnimations();
    this.initScrollAnimations();
    // }, 4000);


    this.marqueeAnimation()
    this.pinnedContentAnimation()

  }

  public pinnedContentAnimation(): void {
    gsap.from(".about-page_text", {
      y: 100, // Desplazamiento inicial
      opacity: 0,
      duration: 1, // Duración de la animación
      scrollTrigger: {
        trigger: ".about-page_text", // Elemento que activa la animación
        start: "top 80%", // Comienza la animación cuando el 80% del elemento está en la vista
        end: "bottom 20%", // Termina la animación cuando el 20% del elemento está en la vista
        scrub: true, // Hace que la animación se sincronice con el scroll
      }
    });

    // gsap.defaults({ overwrite: 'auto' });

    // const ST = ScrollTrigger.create({
    //   trigger: ".about-page_text",
    //   start: "top top",
    //   end: "bottom bottom",
    //   onUpdate: getCurrentSection,
    //   pin: ".text_title-about"
    // })

    // const contentMarkers = gsap.utils.toArray(".content_marker");
    // console.log("contentMarkers >", contentMarkers);

    // contentMarkers.forEach((marker: any) => {
    //   console.log("marker >", marker);

    //   marker.content = document.querySelector(`#${marker.dataset.markerContent}`)
    //   console.log("marker.content", marker.content)
    //   console.log("marker.content.tagName", marker?.content?.tagName)
    //   if (marker?.content?.tagName === "SPAN") {
    //     gsap.set(marker.content, { transformOrigin: "left center" });

    //     marker.content.enter = function () {
    //       gsap.fromTo(marker.content, { autoAlpha: 0, rotateY: 50 }, { duration: 0.3, autoAlpha: 1, rotateY: 0 });
    //     }
    //   }

    //   // marker.content.leave = function () {
    //   //   gsap.to(marker.content, { duration: 0.1, autoAlpha: 0 });
    //   // }

    // });

    // let lastContent: any;
    // function getCurrentSection() {
    //   let newContent;
    //   const currScroll = scrollY;

    //   // Find the current section
    //   contentMarkers.forEach((marker: any) => {
    //     if (currScroll > marker.offsetTop) {
    //       newContent = marker.content;
    //     }
    //   });

    //   // If the current section is different than that last, animate in
    //   // if (newContent)
    //   //   // && (lastContent == null
    //   //   //   || !newContent.isSameNode(lastContent))) {
    //   //   // Fade out last section
    //   //   if (lastContent) {
    //   //     lastContent.leave();
    //   //   }

    //   //   // Animate in new section
    //   //   // newContent.enter();

    //   //   lastContent = newContent;
    //   // }

    // }

    // const media = window.matchMedia("screen and (max-width:600px)");
    // checkSTState();
    // function checkSTState() {
    //   if (media.matches) {
    //     ST.disable();
    //   } else {
    //     ST.enable();
    //   }
    // }
  }

  public marqueeAnimation(): void {
    if (this.marqueeContainer) {
      gsap.to(".first__marquee", {
        xPercent: -100,
        repeat: -1,
        duration: 20,
        ease: "linear"
      }).totalProgress(0.5);

      let marquee = gsap.to(".second__marquee", {
        xPercent: -100,
        repeat: -1,
        duration: 20,
        ease: "linear",
        timeScale: -1
      }).totalProgress(0.5);

      gsap.set(".marquee-container", { xPercent: 0 });

      gsap.to(marquee, {
        timeScale: -1
      });
    }
  }

  public initScrollAnimations(): void {

    gsap.utils
      .toArray("section")
      .forEach((section: any, i) => {
        gsap.from(section, {
          scrollTrigger: {
            trigger: section,
            scrub: true,
            pin: true,
            start: "top top",
            end: "+=100%",
            toggleActions: "play none none none",

            // pinSpacing: false,
            // snap: {
            //   delay: 0.2,
            //   ease: "power1.inOut"
            // }
          },
          // scaleX: 0,
          // transformOrigin: "left center",
          ease: "linear"
        })
      });
    // gsap.to(this.firstContainer.nativeElement, {
    //   x: '100%',
    //   scrollTrigger: {
    //     trigger: this.firstContainer.nativeElement,
    //     start: 'top',
    //     end: 'bottom',
    //     scrub: true
    //   }
    // });

    // gsap.to(this.secondContainer.nativeElement, {
    //   x: '-100%',
    //   scrollTrigger: {
    //     trigger: this.secondContainer.nativeElement,
    //     start: 'top',
    //     end: 'bottom',
    //     scrub: true
    //   }
    // });

    // gsap.to(this.thirdContainer.nativeElement, {
    //   x: '100%',
    //   scrollTrigger: {
    //     trigger: this.thirdContainer.nativeElement,
    //     start: 'top',
    //     end: 'bottom',
    //     scrub: true
    //   }
    // });

    // gsap.to(this.textTitleOne.nativeElement, {
    //   scrollTrigger: {
    //     trigger: this.textTitleOne.nativeElement,
    //     scrub: true,
    //     start: '110% center'
    //   } as ScrollTrigger.Vars,
    //   duration: 1.1,
    //   // scale: 1.2,
    //   opacity: 0,
    //   // height: 250,
    // })

    // gsap.to(this.textTitleTwo.nativeElement, {
    //   scrollTrigger: {
    //     trigger: this.textTitleTwo.nativeElement,
    //     scrub: true,
    //     start: '110% center'
    //   } as ScrollTrigger.Vars,
    //   duration: 1.1,
    //   // scale: 1.2,
    //   opacity: 0,
    //   // height: 250,
    // })

    // gsap.to(this.textTitleThree.nativeElement, {
    //   scrollTrigger: {
    //     trigger: this.textTitleThree.nativeElement,
    //     scrub: true,
    //     start: '110% center'
    //   } as ScrollTrigger.Vars,
    //   duration: 1.1,
    //   // scale: 1.2,
    //   opacity: 0,
    //   // height: 250,
    // })

    // gsap.to(this.textTitleFour.nativeElement, {
    //   scrollTrigger: {
    //     trigger: this.textTitleFour.nativeElement,
    //     scrub: true,
    //     start: '110% center'
    //   } as ScrollTrigger.Vars,
    //   duration: 1.1,
    //   // scale: 1.2,
    //   opacity: 0,
    //   // height: 250,
    // })

    // gsap.to(this.textTitleFive.nativeElement, {
    //   scrollTrigger: {
    //     trigger: this.textTitleFive.nativeElement,
    //     scrub: true,
    //     start: '110% center'
    //   } as ScrollTrigger.Vars,
    //   duration: 1.1,
    //   // scale: 1.2,
    //   opacity: 0,
    //   // height: 250,
    // })
  }

  public initialAnimations(): void {
    gsap.from(this.firstContainer.nativeElement, {
      duration: 0.5,
      opacity: 0,
      y: -20,
      stagger: 0.2,
      delay: 0.5
    });

    gsap.from(this.secondContainer.nativeElement, {
      duration: 0.5,
      opacity: 0,
      y: -20,
      stagger: 0.2,
      delay: 0.5
    })
  }


}
