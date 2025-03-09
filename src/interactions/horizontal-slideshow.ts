import { gsap } from 'gsap';

import { debounce, rem2Px } from '$utils';

export class HorizontalSlideshow {
    private LIST_ATTRIBUTE = 'slideshow-list';
    private LIST_ITEM_ATTRIBUTE = 'slideshow-item';
    private BUTTON_RIGHT_ATTRIBUTE = 'slideshow-button-right';
    private BUTTON_LEFT_ATTRIBUTE = 'slideshow-button-left';

    private _scrollTween?: gsap.core.Tween | null;

    private _list: HTMLElement | null;
    private _listItem: HTMLElement | null;
    private _gap: number;
    private _buttonRight: HTMLElement | null;
    private _buttonLeft: HTMLElement | null;

    private _maxLeftScroll = 0;
    private _maxRightScroll = 0;
    private _itemWidth = 0;

    /**
     * Initialize a horizontal slideshow.
     * @param gap The gap to maintain between the list items in rem.
     * @param id The ID, used to enable multiple instances on one page.
     */
    constructor(gap: number, id: string) {
        this._buttonLeft = document.querySelector(`[${this.BUTTON_LEFT_ATTRIBUTE}=${id}]`);
        this._buttonRight = document.querySelector(`[${this.BUTTON_RIGHT_ATTRIBUTE}=${id}]`);
        this._list = document.querySelector(`[${this.LIST_ATTRIBUTE}=${id}]`);
        this._listItem = document.querySelector(`[${this.LIST_ITEM_ATTRIBUTE}=${id}]`);
        this._gap = gap;

        this.initialize();
    }

    private initialize() {
        if (!(this._buttonLeft && this._buttonRight && this._list && this._listItem)) {
            // eslint-disable-next-line no-console
            console.error(`HorizontalSlideshow | Did't find all elements in document`, this);
            return;
        }

        const listWidth = this._list.scrollWidth;
        const listViewportWidth = this._list.offsetWidth;
        this._itemWidth = this._listItem.offsetWidth;
        const pxGap = rem2Px(this._gap);
        const itemsInView = Math.max(listViewportWidth / (this._itemWidth + pxGap));

        this._maxLeftScroll = Math.max(listWidth / (this._itemWidth + pxGap)) - itemsInView;
        this._maxRightScroll = 0;

        this._buttonLeft.onclick = () => {
            this.buttonLeftClickHandler();
        };
        this._buttonRight.onclick = () => {
            this.buttonRightClickHandler();
        };

        gsap.set(this._buttonLeft, { opacity: 0.5, cursor: 'not-allowed' });

        window.addEventListener(
            'resize',
            debounce(() => {
                this.reload();
            }, 500)
        );
    }

    private buttonLeftClickHandler() {
        if (Math.floor(this._maxRightScroll) > 0) {
            this.scroll('+');
            this._maxLeftScroll += 1;
            this._maxRightScroll -= 1;

            gsap.set(this._buttonRight, { opacity: 1, cursor: 'pointer' });

            if (Math.floor(this._maxRightScroll) == 0) {
                gsap.set(this._buttonLeft, { opacity: 0.5, cursor: 'not-allowed' });
            }
        }
    }

    private buttonRightClickHandler() {
        if (Math.floor(this._maxLeftScroll) > 0) {
            this.scroll('-');
            this._maxLeftScroll -= 1;
            this._maxRightScroll += 1;

            gsap.set(this._buttonLeft, { opacity: 1, cursor: 'pointer' });

            if (Math.floor(this._maxLeftScroll) == 0) {
                gsap.set(this._buttonRight, { opacity: 0.5, cursor: 'not-allowed' });
            }
        }
    }

    private scroll(direction: '-' | '+') {
        const translationDistance = Math.floor(this._itemWidth + rem2Px(this._gap));
        if (this._scrollTween) this._scrollTween.progress(1);
        this._scrollTween = gsap.to(this._list, {
            x: `${direction}=${translationDistance}`,
            duration: 1,
            ease: 'back.out(2)',
        });

        this._scrollTween.then((self) => {
            self.kill();
            this._scrollTween = null;
        });
    }

    /**
     * Reload the horizontal slideshow.
     */
    public reload() {
        this.dispose();
        this.initialize();
    }

    /**
     * Dispose the horizontal slideshow.
     */
    public dispose() {
        if (this._scrollTween) {
            this._scrollTween.kill();
            this._scrollTween = null;
        }

        // Reset position
        gsap
            .to(this._list, {
                x: 0,
                duration: 1,
                ease: 'back.out(2)',
            })
            .then((self) => self.kill());
    }
}