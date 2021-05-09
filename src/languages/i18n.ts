import { init, addMessages, getLocaleFromNavigator } from 'svelte-i18n';
import en from './en.json';
import de from './de.json';

export default function (locale: 'de' | 'en' | null) {
    addMessages('de', de);
    addMessages('en', en);

    init({
        fallbackLocale: 'en',
        initialLocale: locale === null ? getLocaleFromNavigator() : locale,
    });
}
