import { Component, ElementRef, OnInit } from '@angular/core';
import { ResizeObserverService } from 'projects/poc/src/app/resize-observer.service';
import { fromEvent, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ResizeObserverService],
})
export class AppComponent implements OnInit {
  borderBoxSize: any;

  constructor(private ros: ResizeObserverService) {}

  ngOnInit(): void {
    this.ros.onResize$.subscribe((e) => {
      this.borderBoxSize = e.borderBoxSize;
      console.log(this.borderBoxSize);
    });
  }

  // resizeObservable$: Observable<Event>;
  // resizeSubscription$: Subscription;

  // constructor(private element: ElementRef) {}

  // ngOnInit() {
  //   this.resizeObservable$ = fromEvent(this.element.nativeElement, 'resize');
  //   this.resizeSubscription$ = this.resizeObservable$.subscribe((e) => {
  //     this.borderBoxSize = e;
  //     console.log(this.borderBoxSize);
  //   });
  // }

  // ngOnDestroy() {
  //   this.resizeSubscription$.unsubscribe();
  // }
}
