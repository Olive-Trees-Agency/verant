import { MobileMenuAnimation, NavigationTransitionAnimation, CharsSlideUpScrollAnimation, WordsSlideUpScrollAnimation, FadeInScrollAnimation } from "$animations";
import { Cursor } from "$interactions";
import { matchMobileAll } from '$utils';


export class Page {
    // Animations
    protected _mobileNavigationAnimation?: MobileMenuAnimation;
    protected readonly _navigationTransitionAnimation: NavigationTransitionAnimation
    protected readonly _charsSlideUpScrollAnimation?: CharsSlideUpScrollAnimation;
    protected readonly _wordsSlideUpScrollAnimation?: WordsSlideUpScrollAnimation;
    protected readonly _fadeInScrollAnimation?: FadeInScrollAnimation;
    // Interactions
    protected readonly _cursorInteraction: Cursor;

    // Properties
    protected _isLoaded = false;
    protected _isPerformantDevice = navigator.hardwareConcurrency > 2;

    /**
     * Create a new default page.
     */
    constructor() {
        // 01. Register core animations
        if (matchMobileAll.matches) {
            this._mobileNavigationAnimation = new MobileMenuAnimation();
        }
        matchMobileAll.addEventListener('change', (e) => {
            if (e.matches) {
                this._mobileNavigationAnimation = new MobileMenuAnimation();
            } else {
                this._mobileNavigationAnimation?.dispose();
            }
        });
        this._cursorInteraction = new Cursor();

        // 02. Only register these animations when the device is performant enough.
        if (this._isPerformantDevice) {
            this._charsSlideUpScrollAnimation = new CharsSlideUpScrollAnimation();
            this._wordsSlideUpScrollAnimation = new WordsSlideUpScrollAnimation();
            this._fadeInScrollAnimation = new FadeInScrollAnimation();
        }

        // 03. Initialize page transition last to ensure everything is loaded properly
        this._navigationTransitionAnimation = new NavigationTransitionAnimation();

        // 04. Call finish loading
        // Only call the finishLoading function from here when this class hasn't been extended
        // otherwise the function will not be called, now the class that extends this class
        // has the responsibility to call the finishLoading function
        if (this.constructor === Page) {
            // The Page class is not extended so call finish loading
            this.finishLoading();
        }
    }

    /**
     * Hide the page loading animation.
     *
     * If the page has already finished loading once, the animation will not replay.
     */
    protected finishLoading() {
        if (!this._isLoaded) this._navigationTransitionAnimation.playPageTransition('out');
        this._isLoaded = true;
    }
}