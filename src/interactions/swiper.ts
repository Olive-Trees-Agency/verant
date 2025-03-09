import Swiper from "swiper";
import 'swiper/css';

export class SwiperSlideshow {
    private LIST_WRAPPER_ATTRIBUTE = 'slideshow-list-wrapper';
    private LIST_ATTRIBUTE = 'slideshow-list';
    private LIST_ITEM_ATTRIBUTE = 'slideshow-item';
    private BUTTON_NEXT_ATTRIBUTE = 'slideshow-button-next';
    private BUTTON_PREV_ATTRIBUTE = 'slideshow-button-prev';

    private _listWrapper: HTMLElement | null;
    private _list: HTMLElement | null;
    private _listItems: NodeListOf<HTMLElement> | null;
    private _gap: number | string;
    private _buttonNext: HTMLElement | null;
    private _buttonPrev: HTMLElement | null;


    /**
     * Create a swiper slideshow.
     * @param gap The gap to maintain between the list items in rem.
     * @param id The ID, used to enable multiple instances on one page (not supported yet).
     */
    constructor(gap: string | number, id: string) {
        this._buttonPrev = document.querySelector(`[${this.BUTTON_PREV_ATTRIBUTE}=${id}]`);
        this._buttonNext = document.querySelector(`[${this.BUTTON_NEXT_ATTRIBUTE}=${id}]`);
        this._listWrapper = document.querySelector(`[${this.LIST_WRAPPER_ATTRIBUTE}=${id}]`);
        this._list = document.querySelector(`[${this.LIST_ATTRIBUTE}=${id}]`);
        this._listItems = document.querySelectorAll(`[${this.LIST_ITEM_ATTRIBUTE}=${id}]`);
        this._gap = gap;

        // Add swiper classes
        this._list?.classList.add('swiper-wrapper');
        this._listItems?.forEach((item) => {
            item.classList.add('swiper-slide');
        });

        const swiper = new Swiper(this._listWrapper ?? '.swiper', {
            spaceBetween: this._gap,
            loop: false,
            direction: "horizontal",
            speed: 300,
            centeredSlides: false,
            slidesPerView: 2.5,
            slidesPerGroup: 1,
            breakpoints: {
                // when window width is >= 480px
                480: {
                    slidesPerView: 3.5
                }
            }
        });

        // Add events ourself because swiper navigation options don't seem to be working.
        this._buttonNext?.addEventListener('click', () => {
            swiper.slideNext();
        });

        this._buttonPrev?.addEventListener('click', () => {
            swiper.slidePrev();
        });
    }
}

