import { Page } from './page';
import { SwiperSlideshow } from '$interactions';

export class ProjectenPage extends Page {

    /**
     * Create a new Diensten page.
     */
    constructor() {
        super();

        new SwiperSlideshow(0, 'running-projects');

        this.finishLoading();
    }
}