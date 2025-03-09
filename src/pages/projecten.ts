import { Page } from './page';
import { HorizontalSlideshow } from '$interactions';

export class ProjectenPage extends Page {

    /**
     * Create a new Diensten page.
     */
    constructor() {
        super();

        new HorizontalSlideshow(2, 'running-projects');

        this.finishLoading();
    }
}