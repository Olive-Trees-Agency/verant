export abstract class ScrollAnimation {
    protected ELEMENTS_SELECTOR: string;

    protected _elements: NodeListOf<HTMLElement>;
    public get elements(): NodeListOf<HTMLElement> {
        return this._elements;
    }

    protected _timelines: Array<gsap.core.Timeline>;
    public get timelines(): ReadonlyArray<gsap.core.Timeline> {
        return [...this._timelines];
    }

    protected _scrollTriggers: Array<globalThis.ScrollTrigger>;
    public get scrollTriggers(): ReadonlyArray<globalThis.ScrollTrigger> {
        return [...this._scrollTriggers];
    }

    /**
     * Create the fundamentals for a scroll animation.
     */
    constructor(elementsSelector: string) {
        this.ELEMENTS_SELECTOR = elementsSelector;
        this._elements = document.querySelectorAll(this.ELEMENTS_SELECTOR);
        this._timelines = [];
        this._scrollTriggers = [];
    }

    /**
     * Initialize all the `scrollTrigger` animations and `timelines`.
     */
    protected abstract initialize(): void;

    /**
     * Kill all the `scrollTrigger` animations and `timelines`.
     */
    public dispose() {
        this._timelines.forEach((timeline) => {
            timeline.kill();
        });
        this._timelines = [];

        this._scrollTriggers.forEach((scrollTrigger) => {
            scrollTrigger.kill();
        });
        this._scrollTriggers = [];
    }
}