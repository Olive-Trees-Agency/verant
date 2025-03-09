import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { ScrollTriggerAttributes, TimelineAttributes } from '$utils/gsap-attributes';
import { TextSplit } from '$utils';

import { ScrollAnimation } from './base/scroll-animation';

gsap.registerPlugin(ScrollTrigger);

abstract class TextSplitScrollAnimation extends ScrollAnimation {
    protected _scope: 'characters' | 'words';

    protected _textSplit: TextSplit;
    public get textSplit(): TextSplit {
        return this._textSplit;
    }

    /**
     * Create a `TextSplitScrollAnimation`.
     * @param textElementSelector The HTML selector used to get all text elements on which the animation will be applied.
     */
    constructor(textElementSelector: string, scope: 'characters' | 'words') {
        super(textElementSelector);
        this._scope = scope;
        // Splits the text in all elements
        this._textSplit = new TextSplit(this._elements);
        // Reload the animations when text split is reloaded
        this._textSplit.addEventListener('reload', () => this.textSplitReloadHandler());

        this.initialize();
    }

    private textSplitReloadHandler() {
        this.reload(false);
    }

    /**
     * Reloads the animation.
     */
    public reload(reloadTextSplit = true) {
        this._timelines = [];
        this._scrollTriggers = [];
        if (reloadTextSplit) {
            this.textSplit.reload(true);
        }
        this.initialize();
    }

    /**
     * Kill all the `scrollTrigger` animations, `timelines` and text split.
     */
    public override dispose() {
        super.dispose();
        this._textSplit.removeEventListener('reload', this.textSplitReloadHandler);
        this._textSplit.revert();
    }
}

class TextSlideUpScrollAnimation extends TextSplitScrollAnimation {
    /**
     * Create a `TextSlideUpScrollAnimation`.
     * @param textElementSelector The HTML selector used to get all text elements on which the animation will be applied.
     */
    constructor(textElementSelector: string, scope: 'characters' | 'words') {
        super(textElementSelector, scope);
    }

    protected initialize() {
        this._elements.forEach((element, i) => {
            const stAttributes = new ScrollTriggerAttributes(element);
            const tlAttributes = new TimelineAttributes(element);

            // Disable overflow of text lines for animation effect
            gsap.set(element.querySelectorAll('.text-line'), { overflow: 'hidden' });

            const tl = gsap.timeline({ paused: true, delay: tlAttributes.delay });
            this._timelines.push(tl);
            tl.from(element.querySelectorAll(this._scope === 'characters' ? '.char' : '.word'), {
                opacity: 0,
                yPercent: 100,
                duration: tlAttributes.duration,
                ease: tlAttributes.ease ?? 'back.out(1)',
                stagger: { amount: tlAttributes.stagger },
            });

            this._scrollTriggers.push(
                ScrollTrigger.create({
                    id: stAttributes.id ?? `${this.ELEMENTS_SELECTOR}-${i}`,
                    trigger: element,
                    start: stAttributes.begin,
                    end: stAttributes.end,
                    markers: false,
                    onEnter: () => tl.play(),
                    onLeave: stAttributes.direction == 'both' ? () => tl.reverse() : undefined,
                    onEnterBack: stAttributes.direction == 'both' ? () => tl.play() : undefined,
                    onLeaveBack: stAttributes.direction == 'both' ? () => tl.reverse() : undefined,
                })
            );
        });
    }
}

export class CharsSlideUpScrollAnimation extends TextSlideUpScrollAnimation {
    /**
     * Registers the `CharsSlideUpAnimation` on all elements with the `chars-slide-up` HTML attribute.
     *
     * Optional HTML attributes:
     * - id
     * - begin (ex. top 20%)
     * - end (ex. top bottom)
     * - duration (defaults to 0.5 seconds)
     * - stagger (defaults to 0.5)
     */
    constructor() {
        super('[chars-slide-up]', 'characters');
    }
}

export class WordsSlideUpScrollAnimation extends TextSlideUpScrollAnimation {
    /**
     * Registers the `WordsSlideUpAnimation` on all elements with the `words-slide-up` HTML attribute.
     *
     * Optional HTML attributes:
     * - id
     * - begin (ex. top 20%)
     * - end (ex. top bottom)
     * - duration (defaults to 0.5 seconds)
     * - stagger (defaults to 0.5)
     */
    constructor() {
        super('[words-slide-up]', 'words');
    }
}

class TextStaggeredFadeInScrollAnimation extends TextSplitScrollAnimation {
    /**
     * Create a `TextStaggeredFadeScrollAnimation`.
     * @param textElementSelector The HTML selector used to get all text elements on which the animation will be applied.
     */
    constructor(textElementSelector: string, scope: 'characters' | 'words') {
        super(textElementSelector, scope);
    }

    protected initialize() {
        this._elements.forEach((element, i) => {
            const stAttributes = new ScrollTriggerAttributes(element);
            const tlAttributes = new TimelineAttributes(element);

            const tl = gsap.timeline({ paused: true, delay: tlAttributes.delay });
            this._timelines.push(tl);
            tl.from(element.querySelectorAll(this._scope === 'characters' ? '.char' : '.word'), {
                opacity: 0,
                duration: tlAttributes.duration,
                ease: tlAttributes.ease ?? 'back.out(1)',
                stagger: { amount: tlAttributes.stagger },
            });;

            this._scrollTriggers.push(
                ScrollTrigger.create({
                    id: stAttributes.id ?? `${this.ELEMENTS_SELECTOR}-${i}`,
                    trigger: element,
                    start: stAttributes.begin,
                    end: stAttributes.end,
                    markers: false,
                    onEnter: () => tl.play(),
                    onLeave: stAttributes.direction == 'both' ? () => tl.reverse() : undefined,
                    onEnterBack: stAttributes.direction == 'both' ? () => tl.play() : undefined,
                    onLeaveBack: stAttributes.direction == 'both' ? () => tl.reverse() : undefined,
                })
            );
        });
    }
}

export class CharsStaggeredFadeScrollAnimation extends TextStaggeredFadeInScrollAnimation {
    /**
     * Registers the `CharsStaggeredFadeScrollAnimation` on all elements with the `chars-staggered-fade` HTML attribute.
     *
     * Optional HTML attributes:
     * - id
     * - begin (ex. top 20%)
     * - end (ex. top bottom)
     * - duration (defaults to 0.5 seconds)
     * - stagger (defaults to 0.5)
     */
    constructor() {
        super('[chars-staggered-fade]', 'characters');
    }
}

export class WordsStaggeredFadeScrollAnimation extends TextStaggeredFadeInScrollAnimation {
    /**
     * Registers the `WordsStaggeredFadeScrollAnimation` on all elements with the `words-staggered-fade` HTML attribute.
     *
     * Optional HTML attributes:
     * - id
     * - begin (ex. top 20%)
     * - end (ex. top bottom)
     * - duration (defaults to 0.5 seconds)
     * - stagger (defaults to 0.5)
     */
    constructor() {
        super('[words-staggered-fade]', 'words');
    }
}