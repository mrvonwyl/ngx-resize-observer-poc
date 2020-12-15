import {
  ChangeDetectorRef,
  ElementRef,
  Inject,
  Injectable,
  InjectionToken,
  OnDestroy,
  Optional,
} from '@angular/core';
import { Observable, Subject } from 'rxjs';

declare var window: any;

export const NATIVE_RESIZE_OBSERVER = new InjectionToken<ResizeObserver>(
  'NativeResizeObserver',
  {
    providedIn: 'root',
    factory: () => window.ResizeObserver,
  }
);

@Injectable({
  providedIn: 'root',
})
export class ResizeObserverService implements OnDestroy {
  private resizeObserver: ResizeObserver;

  private onResizeSubject = new Subject<ResizeObserverEntry>();
  public onResize$: Observable<ResizeObserverEntry> = this.onResizeSubject.asObservable();

  constructor(
    private cdr: ChangeDetectorRef,
    @Optional() private elementRef: ElementRef,
    @Inject(NATIVE_RESIZE_OBSERVER) private ResizeObserver: ResizeObserver
  ) {
    if (this.elementRef === null) {
      console.error(
        `ng-resize-observer: No provider for ElementRef. This error is most likely because you added the ng-resize-observer provider in a @NgModule. Only add ng-resize-observer on @Component()`
      );
      return;
    }

    if (this.ResizeObserver === null) {
      console.error(
        `ng-resize-observer: ResizeObserver not available. Use the ponyfill module: NgResizeObserverPonyfillModule.`
      );
      return;
    }

    this.observe();
  }

  private observe() {
    this.resizeObserver = new ResizeObserver(
      (entries: ResizeObserverEntry[]) => {
        const entry: ResizeObserverEntry = entries && entries[0];
        if (entry) {
          this.onResizeSubject.next(entry);
          this.cdr.detectChanges();
        }
      }
    );
    this.resizeObserver.observe(this.target);
  }

  ngOnDestroy(): void {
    this.unobserve();
    this.onResizeSubject.complete();
  }

  private unobserve() {
    this.resizeObserver.unobserve(this.target);
  }

  private get target() {
    return this.elementRef.nativeElement;
  }
}
