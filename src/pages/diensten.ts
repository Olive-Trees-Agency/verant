import { Page } from './page';
import { Collapsible } from '$interactions';

export class DienstenPage extends Page {

    /**
     * Create a new Diensten page.
     */
    constructor() {
        super();

        new Collapsible('flex');

        this.finishLoading();
    }
}