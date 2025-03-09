import { gsap } from 'gsap';

import { debounce } from '$utils';

export class Collapsible {
    /** To be applied to the click target (element that opens the collapsible on click). */
    private CLICK_TARGET_SELECTOR = '[ot-collapsible=click-target]';
    /** To be applied to an optional icon that can be rotated on opening the collapsible. */
    private ICON_SELECTOR = '[ot-collapsible=icon]';
    /** To be applied to the element that should collapse. */
    private COLLAPSIBLE_SELECTOR = '[ot-collapsible=item]'

    /** The current state of the collapsible. */
    public isOpen = false;

    /**
     * Creates an instance of collapsible.
     * 
     * ---
     * 
     * Currently only one collapsible per page supported!
     */
    constructor(collapsibleDisplayMode: 'block' | 'flex' | 'grid' | 'inline-block' | 'inline-flex' | 'inline-grid' | 'inline', iconOptions: { initialRotation: number, expandedRotation: number } = { initialRotation: 0, expandedRotation: 180 }) {
        const clickTarget = document.querySelector<HTMLElement>(this.CLICK_TARGET_SELECTOR);
        const icon = document.querySelector(this.ICON_SELECTOR);
        const collapsible = document.querySelector<HTMLElement>(this.COLLAPSIBLE_SELECTOR);

        console.log(collapsible?.offsetHeight)

        const tl = gsap.timeline({ paused: true, defaults: { ease: 'sine.inOut' } });
        tl.add('start');
        tl.fromTo(
            collapsible,
            { height: 0, opacity: 0, display: 'none', padding: 0 },
            { height: collapsible?.offsetHeight, opacity: 1, display: collapsibleDisplayMode },
            'start'
        );
        tl.fromTo(
            icon,
            { rotate: iconOptions.initialRotation },
            { rotate: iconOptions.expandedRotation },
            'start'
        );

        clickTarget?.addEventListener('click', () => {
            if (!this.isOpen) {
                tl.play();
                this.isOpen = true;
            } else {
                tl.reverse();
                this.isOpen = false;
            }
        });

        // Recalculate tl after resize to avoid flicker when playing animation.
        window.addEventListener(
            'resize',
            debounce(() => {
                tl.invalidate();
            }, 500)
        );
    }
}