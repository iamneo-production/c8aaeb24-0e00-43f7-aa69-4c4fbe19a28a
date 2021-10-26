import { Component, OnDestroy, OnInit } from '@angular/core';
import { MediaObserver, MediaChange } from '@angular/flex-layout';
import { Meta } from '@angular/platform-browser';
import { Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { fader } from './services/routeanimation/route-animations';
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
	constructor(
		public mediaObserver: MediaObserver,
		private meta: Meta,
		private router: Router
	) {
		this.meta.addTags([
			{
				name: 'keywords',
				content:
					'EBook Store, Virtusa, Neural Hack Season 5, Buy Books, Books, Order',
			},
			{ name: 'robots', content: 'index, follow' },
			{ name: 'author', content: 'Team 2' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ name: 'date', content: '2021-10-20', scheme: 'YYYY-MM-DD' },
			{ charset: 'UTF-8' },
		]);
	}

	ngOnInit() {
		this.mediaSub = this.mediaObserver.media$.subscribe(
			(result: MediaChange) => {
				this.deviceXs = result.mqAlias === 'xs' ? true : false;
			}
		);
		if (!!localStorage.getItem('token')) {
			this.router.navigate(['/home']);
		}
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
