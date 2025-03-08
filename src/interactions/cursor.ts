import { gsap } from 'gsap';

import { isMobileDevice, matchDesktop } from '$utils';

export class Cursor {
    /**
     * Initialize the cursor animation to animate links and buttons on hover.
     * All of the following elements will play the animation on hover: `a`, `button` and elements with the `cursor-target` attribute defined.
     *
     * This animation is not loaded on mobile devices.
     */
    constructor() {
        if (matchDesktop.matches && !isMobileDevice()) {
            document
                .querySelectorAll('a, button, [cursor-target]')
                .forEach((element) => {
                    element.addEventListener('mouseenter', () => {
                        // gsap.to(cursor, { fontSize: '2rem', opacity: 0.8, ease: 'back.out(2)' });
                    });

                    element.addEventListener('mouseleave', () => {
                        // gsap.to(cursor, { fontSize: '1rem', opacity: 1, ease: 'back.out(2)' });
                    });
                });
        }
    }
}