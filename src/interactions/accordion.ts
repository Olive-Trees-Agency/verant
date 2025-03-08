import { gsap } from 'gsap';

import { debounce } from '$utils';

export type AccordionArrowOptions = { initialRotation: number; expandedRotation: number };

export class Accordion {
    /** To be applied to the collection list (not the wrapper). */
    private LIST_SELECTOR = '[ot-accordion=list]';
    /** To be applied to the inner text of the accordion. */
    private ITEM_TEXT_SELECTOR = '[ot-accordion-item=text]';
    /** To be applied to the click target (element that opens the accordion on click). */
    private ITEM_CLICK_TARGET_SELECTOR = '[ot-accordion-item=click-target]';
    /** To be applied to an optional icon that can be rotated on opening the accordion. */
    private ITEM_ICON_SELECTOR = '[ot-accordion-item=icon]';

    private _iconOptions?: AccordionArrowOptions;

    private _lists: NodeListOf<HTMLElement>;

    /**
     * Initialize the `Accordion` for all Collection Lists with the `ot-accordion=list` attribute.
     *
     * 1. The list items should have an element with the `ot-accordion-item=text` attribute set, this element contains the text that will be hidden and expanded.
     * 2. The list items should also have a click target with the `ot-accordion-item=click-target` attribute set, multiple click targets are possible.
     * 3. Optionally the list items can contain an icon element which will be rotated on opening/closing following the `iconOptions`.
     *
     * ---
     *
     * Example HTML (based on Webflow's default collection list):
     * ```html
     * <div class="collection-wrapper">
     *  <div class="collection-list" ot-accordion="list">
     *    <div class="collection-item">
     *      <div class="collection-item_header" ot-accordion-item="click-target">
     *        <h3 class="collection-item_header_title">
     *          Accordion item title
     *        </h3>
     *        <div class="collection-item_header_arrow" ot-accordion-item="icon">
     *          <!-- Icon here -->
     *        </div>
     *      </div>
     *      <div class="collection-item_text-wrapper">
     *        <span ot-accordion-item="text">This is the text that will expand or close.</span>
     *      </div>
     *    </div>
     *  </div>
     * </div>
     * ```
     *
     * ---
     *
     * @param iconOptions The options for animating the optional icon.
     */
    constructor(iconOptions?: AccordionArrowOptions) {
        this._iconOptions = iconOptions;

        this._lists = document.querySelectorAll(this.LIST_SELECTOR);
        if (!this._lists || !this._lists.length) {
            // eslint-disable-next-line no-console
            console.error(`Accordion | Can't find ${this.LIST_SELECTOR} in document`);
            return;
        }

        this._lists.forEach((list) => {
            const accordionItems = [...list.children];

            accordionItems.forEach((item) => {
                const text = item.querySelector(this.ITEM_TEXT_SELECTOR);
                const clickTargets = item.querySelectorAll<HTMLElement>(this.ITEM_CLICK_TARGET_SELECTOR);

                if (!text || !clickTargets.length) {
                    // eslint-disable-next-line no-console
                    console.error(
                        `Accordion | Can't find ${this.ITEM_TEXT_SELECTOR} or ${this.ITEM_CLICK_TARGET_SELECTOR} in accordion item`
                    );
                    return;
                }

                let isOpen = false;

                const tl = gsap.timeline({
                    paused: true,
                    defaults: {
                        ease: 'sine.inOut',
                    },
                });
                tl.add('start');
                tl.fromTo(text, { height: 0, opacity: 0 }, { height: 'auto' }, 'start');
                if (this._iconOptions) {
                    const icon = item.querySelector(this.ITEM_ICON_SELECTOR);
                    tl.fromTo(
                        icon,
                        { rotate: this._iconOptions.initialRotation },
                        { rotate: this._iconOptions.expandedRotation },
                        'start'
                    );
                }
                tl.fromTo(text, { opacity: 0 }, { opacity: 1 });

                clickTargets.forEach((clickTarget) => {
                    clickTarget.onclick = () => {
                        if (!isOpen) {
                            tl.play();
                            isOpen = true;
                        } else {
                            tl.reverse();
                            isOpen = false;
                        }
                    };
                });

                window.addEventListener(
                    'resize',
                    debounce(() => {
                        tl.invalidate();
                    }, 500)
                );
            });
        });
    }
}