export class ScrollTriggerAttributes {
    public id?: string;
    public begin?: string;
    public end?: string;

    /**
     * Gets all possible HTML attributes related to a ScrollTrigger.
     */
    constructor(element: Element) {
        this.id =
            (element.getAttribute('scroll-trigger-id') || element.getAttribute('id')) ?? undefined;
        this.begin = element.getAttribute('begin') ?? undefined;
        this.end = element.getAttribute('end') ?? undefined;
    }
}

export class TimelineAttributes {
    /** Defaults to `0.5` if the `stagger` attribute is not found on the element. */
    public stagger: number;
    /** Defaults to `0.5` seconds if `duration` attribute is not found on the element. */
    public duration: number;
    /** Defaults to `0` seconds if `delay` attribute is not found on the element. */
    public delay: number;
    /** Can contain a gsap ease string or undefined when the attribute was not found. */
    public ease?: string;

    /**
     * Gets all possible HTML attributes related to a Timeline.
     */
    constructor(element: Element) {
        const _stagger = element.getAttribute('stagger');
        const _duration = element.getAttribute('duration');
        const _delay = element.getAttribute('delay');
        const _ease = element.getAttribute('ease');
        this.stagger = _stagger ? parseFloat(_stagger) : 0.5;
        this.duration = _duration ? parseFloat(_duration) : 0.5;
        this.delay = _delay ? parseFloat(_delay) : 0;
        this.ease = _ease ?? undefined;
    }
}