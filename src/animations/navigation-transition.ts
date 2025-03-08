import { gsap } from 'gsap';

export class NavigationTransitionAnimation {
    private PAGE_TRANSITION_WRAPPER = '[page-transition="wrapper"]';
    private PAGE_TRANSITION_LOGO = '[page-transition="logo"]';
    /** Only here for documentation purposes to show which attribute to set to disable the page transition animation. */
    private ANCHOR_NO_PAGE_TRANSITION = '[page-transition="disable"]';

    private _anchorElements: NodeListOf<HTMLAnchorElement>;

    private tl: gsap.core.Timeline;

    /**
     * Creates a navigation transition animation.
     * - Automatically closes the loading screen when the page was cached earlier.
     */
    constructor() {
        // Get all links not containing an in-page link, target set to _blank or manually disabled links.
        // In-page links and target _blank should not show the navigation transition.
        this._anchorElements = document.querySelectorAll(`a:not([href^="#"], [target="_blank"], ${this.ANCHOR_NO_PAGE_TRANSITION})`);
        this._anchorElements.forEach(el => {
            el.addEventListener('click', (e) => {
                this.anchorClickHandler(e);
            });
        });
        // Create timeline
        this.tl = gsap.timeline({ paused: true });
        this.tl.add('start');
        this.tl.fromTo(
            this.PAGE_TRANSITION_LOGO,
            // !!! These default values should also be set the head of the website to avoid flickering !!!
            { opacity: 0 },
            { opacity: 1 },
            'start'
        );
        this.tl.fromTo(
            this.PAGE_TRANSITION_WRAPPER,
            // !!! These default values should also be set the head of the website to avoid flickering !!!
            {
                yPercent: 0,
                display: 'flex',
                ease: 'expo'
            },
            {
                yPercent: -101,
                display: 'none',
                duration: 1,
                delay: 0.25,
                ease: 'expo'
            },
            'start'
        );

        window.addEventListener('pageshow', (e) => {
            this.pageShowHandler(e);
        });
    }

    private pageShowHandler(e: PageTransitionEvent) {
        if (e.persisted) {
            // Page was restored from the bfcache: https://web.dev/bfcache/
            return this.playPageTransition('out');
        }
    }

    /**
     * Show the page transition when an applicable anchor element is clicked.
     */
    private anchorClickHandler(e: MouseEvent) {
        const anchorElement = e.currentTarget as HTMLAnchorElement;
        const href = anchorElement.getAttribute('href');

        e.preventDefault();
        this.playPageTransition('in').then(() => {
            if (href) window.location.assign(href);
        });
    }

    /**
     * Play the page transition for navigating between pages.
     * @param direction The direction of the transition.
     */
    public async playPageTransition(direction: 'in' | 'out') {
        return direction == 'out' ? this.tl.play() : this.tl.reverse(0.75);
    }

    public dispose() {
        // this._anchorElements.forEach((anchorElement) => {
        //     anchorElement.removeEventListener('click', this.anchorClickHandler);
        // });
        window.removeEventListener('pageshow', this.pageShowHandler);
    }
}