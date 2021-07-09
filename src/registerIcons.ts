import { library, config } from '@fortawesome/fontawesome-svg-core';
import {
    faArrowLeft,
    faArrowRight,
    faRedo,
    faLightbulb,
    faCheckDouble,
    faCog,
} from '@fortawesome/free-solid-svg-icons';

export default function () {
    config.autoAddCss = false;
    library.add(
        faArrowLeft,
        faArrowRight,
        faRedo,
        faLightbulb,
        faCheckDouble,
        faCog
    );
}
