import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { ScrollTriggerAttributes, TimelineAttributes } from '$utils/gsap-attributes';
import { TextSplit } from '$utils';

import { ScrollAnimation } from './base/scroll-animation';

gsap.registerPlugin(ScrollTrigger);

class TextSlideUpScrollAnimation extends ScrollAnimation {
    private _scope: 'characters' | 'words';

    private _textSplit: TextSplit;
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

    protected initialize() {
        this._elements.forEach((element, i) => {
            const stAttributes = new ScrollTriggerAttributes(element);
            const tlAttributes = new TimelineAttributes(element);

            // Disable overflow of text lines for animation effect
            gsap.set(element.querySelectorAll('.text-line'), { overflow: 'hidden' });

            const tl = gsap.timeline({ paused: true });
            this._timelines.push(tl);
            tl.from(element.querySelectorAll(this._scope === 'characters' ? '.char' : '.word'), {
                opacity: 0,
                yPercent: 100,
                duration: tlAttributes.duration,
                ease: tlAttributes.ease ?? 'back.out(1)',
                stagger: { amount: tlAttributes.stagger },
            });

            const scrollTriggerBaseId =
                this._scope === 'characters' ? 'chars-slide-up' : 'words-slide-up';

            this._scrollTriggers.push(
                ScrollTrigger.create({
                    id: stAttributes.id ?? `${scrollTriggerBaseId}-${i}`,
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

export class CharsSlideUpScrollAnimation extends TextSlideUpScrollAnimation {
    /**
     * Registers the `CharsSlideUpAnimation` on all elements with the `chars-slide-up` HTML attribute.
     *
     * Optional HTML attributes:
     * - id
     * - start (ex. top 20%)
     * - stop (ex. top bottom)
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
     * - start (ex. top 20%)
     * - stop (ex. top bottom)
     * - duration (defaults to 0.5 seconds)
     * - stagger (defaults to 0.5)
     */
    constructor() {
        super('[words-slide-up]', 'words');
    }
}