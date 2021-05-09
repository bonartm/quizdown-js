import { init, addMessages, getLocaleFromNavigator } from 'svelte-i18n';
import en from './en.json';
import de from './de.json';

export default function () {
    addMessages('de', de);
    addMessages('en', en);

    init({
        fallbackLocale: 'en',
        initialLocale: getLocaleFromNavigator(),
    });
}
