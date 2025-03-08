import SplitType, { type SplitTypeOptions, type TargetElement } from 'split-type';

import { debounce } from './debounce';

export class TextSplit extends EventTarget {
    private _windowWidth: number;
    private _splitType: SplitType;
    private _options: Partial<SplitTypeOptions>;

    /**
     * Splits the text of all elements that have the `text-split` attribute set.
     * By default lines, words and chars will be wrapped with a span element.
     *
     * The `reload`event is called when the viewport width is resized, a debounce of 500ms is applied.
     *
     * Set `font-kerning: none` in CSS to improve performance.
     *
     * @param target The target element to apply the text split to.
     * @param options The options for splitting the text.
     * @param debounceTimeout This debounce timeout (ms) is applied to the window's resize event which is the trigger for reloading the text split.
     */
    constructor(
        target: TargetElement = '[text-split]',
        options: Partial<SplitTypeOptions> = {
            types: ['lines', 'words', 'chars'],
            tagName: 'span',
            lineClass: 'text-line',
        },
        debounceTimeout = 100
    ) {
        super();
        this._options = options;
        this._splitType = new SplitType(target, this._options);
        this._windowWidth = window.innerWidth;

        window.addEventListener(
            'resize',
            debounce(() => {
                // Only reload the text split when the viewport width changes because the height doesn't affect text size
                if (this._windowWidth !== window.innerWidth) {
                    this.reload();
                    this._windowWidth = window.innerWidth;
                }
            }, debounceTimeout)
        );
    }

    /**
     * Revert the text split.
     */
    public revert() {
        this._splitType.revert();
    }

    /**
     * Reload the text split by first reverting and the splitting again.
     * @param silent Don't dispatch the `reload` event.
     */
    public reload(silent = false) {
        this._splitType.revert();
        this._splitType.split(this._options);
        if (!silent) this.dispatchEvent(new Event('reload'));
    }

    public addEventListener(
        type: 'reload',
        callback: EventListenerOrEventListenerObject | null,
        options?: AddEventListenerOptions | boolean
    ) {
        super.addEventListener(type, callback, options);
    }

    public removeEventListener(
        type: 'reload',
        callback: EventListenerOrEventListenerObject | null,
        options?: boolean | EventListenerOptions | undefined
    ) {
        super.removeEventListener(type, callback, options);
    }
}