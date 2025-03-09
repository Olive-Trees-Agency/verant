import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Page } from './page';
import { Collapsible } from '$interactions';

export class DienstenPage extends Page {

    /**
     * Create a new Diensten page.
     */
    constructor() {
        super();

        new Collapsible('flex');

        // Refresh all scroll triggers because Collapsible changes the page height by collapsing the content.
        ScrollTrigger.getAll().forEach((st) => st.refresh());

        this.finishLoading();
    }
}