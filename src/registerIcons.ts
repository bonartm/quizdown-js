import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faArrowLeft,
    faArrowRight,
    faRedo,
    faLightbulb,
    faCheckDouble,
} from '@fortawesome/free-solid-svg-icons';

export default function () {
    library.add(faArrowLeft, faArrowRight, faRedo, faLightbulb, faCheckDouble);
}
