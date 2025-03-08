import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { ScrollTriggerAttributes, TimelineAttributes } from '$utils/gsap-attributes';
import { ScrollAnimation } from './base/scroll-animation';

export class FadeInScrollAnimation extends ScrollAnimation {
    /**
     * Apply a fade in animation when scroll into view to all elements with the `fade-in` attribute defined.
     */
    constructor() {
        super('[fade-in]');
        this.initialize();
    }

    protected initialize() {
        this._elements.forEach((element, i) => {
            const stAttributes = new ScrollTriggerAttributes(element);
            const tlAttributes = new TimelineAttributes(element);

            const tl = gsap.timeline({ paused: true, delay: tlAttributes.delay });
            this._timelines.push(tl);
            tl.from(element, {
                opacity: 0,
                duration: tlAttributes.duration,
                ease: tlAttributes.ease ?? 'circ.inOut(1)',
            });

            this._scrollTriggers.push(
                ScrollTrigger.create({
                    id: stAttributes.id ?? `fade-in-${i}`,
                    trigger: element,
                    start: stAttributes.begin,
                    end: stAttributes.end,
                    markers: false,
                    onEnter: () => tl.play(),
                    onLeave: () => tl.reverse(),
                    onEnterBack: () => tl.play(),
                    onLeaveBack: () => tl.reverse(),
                })
            );
        });
    }
}