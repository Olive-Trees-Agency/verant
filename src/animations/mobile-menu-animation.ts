import { simulateEvent } from '@finsweet/ts-utils';
import { gsap } from 'gsap';
import SplitType from 'split-type';

import { matchMobileAll } from '$utils';

export class MobileMenuAnimation {
    private textSplit?: SplitType;
    private tl?: gsap.core.Timeline | null;

    private NAVIGATION_LINKS_WRAPPER = '[navigation="links-wrapper"]';
    private navigationLinksWrapper?: Element | null;

    private NAVIGATION_LINK = '[navigation="link"]';
    private navigationLinks?: NodeListOf<Element> | null;

    private NAVIGATION_LOGO = '[navigation="logo"]';
    private logo?: Element | null;

    private NAVIGATION_MENU_BUTTON = '[navigation="menu-button"]';
    private menuButton?: Element | null;

    private _isMenuOpen = false;
    public get isMenuOpen(): boolean { return this._isMenuOpen }

    /**
     * Initialize the Mobile Menu Animation.
     */
    constructor() {
        // Only register animation when on a mobile device.
        if (!matchMobileAll.matches) return;

        this.navigationLinksWrapper = document.querySelector(this.NAVIGATION_LINKS_WRAPPER);
        this.navigationLinks = this.navigationLinksWrapper?.querySelectorAll(this.NAVIGATION_LINK) ?? null;
        this.logo = document.querySelector(this.NAVIGATION_LOGO);
        this.menuButton = document.querySelector(this.NAVIGATION_MENU_BUTTON);

        // Stop if elements not found
        if (!this.navigationLinksWrapper || !this.logo || !this.menuButton || !this.navigationLinks) return;


    }

    /**
     * Toggle the navigation menu.
     */
    public menuToggle() {
        if (this._isMenuOpen) {
            this.tl?.reverse();
            this._isMenuOpen = false;
        } else {
            this.tl?.play();
            this._isMenuOpen = true;
        }
    }

    /**
     * Dispose the animation and reset to initial state.
     */
    public dispose() {
        this.textSplit?.revert();
        this.tl?.kill();
        this.tl = null;

        this.navigationLinks?.forEach((navLink) => {
            navLink.removeAttribute('style');
        });
        this.navigationLinksWrapper?.removeAttribute('style');
        if (this.navigationLinksWrapper?.children) {
            for (let i = 0; i < this.navigationLinksWrapper?.children.length; i++) {
                this.navigationLinksWrapper.children[i].removeAttribute('style');
            }
        }
        this.logo?.removeAttribute('style');
        this.menuButton?.removeAttribute('style');
        this.menuButton?.removeEventListener('click', this.menuToggle);

        // If navigation still open play lottie animation so that next time menu item is shon instead of X
        if (this._isMenuOpen && this.menuButton) {
            simulateEvent(this.menuButton, 'click');
            this._isMenuOpen = false;
        }
    }
}