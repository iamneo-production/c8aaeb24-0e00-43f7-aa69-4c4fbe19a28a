import { Component, OnDestroy, OnInit } from '@angular/core';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { fader } from './route-animations';
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
	animations: [fader],
})
export class AppComponent implements OnInit, OnDestroy {
	title = 'EBook Store';
	mediaSub: Subscription = new Subscription();
	deviceXs: boolean = false;
	constructor(public mediaObserver: MediaObserver) {}

	ngOnInit() {
		this.mediaSub = this.mediaObserver.media$.subscribe(
			(result: MediaChange) => {
				this.deviceXs = result.mqAlias === 'xs' ? true : false;
			}
		);
	}
	ngOnDestroy() {
		this.mediaSub.unsubscribe();
	}
	prepareRoute(outlet: RouterOutlet) {
		return (
			outlet &&
			outlet.activatedRouteData &&
			outlet.activatedRouteData['animation']
		);
	}
}
