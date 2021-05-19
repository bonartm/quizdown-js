import { init, addMessages, getLocaleFromNavigator } from 'svelte-i18n';
import en from './en.json';
import de from './de.json';
import fr from './fr.json';
import es from './es.json';

export default function (locale: 'de' | 'en' | 'es' | 'fr' | null) {
    addMessages('de', de);
    addMessages('en', en);
    addMessages('fr', fr);
    addMessages('es', es);

    init({
        fallbackLocale: 'en',
        initialLocale: locale === null ? getLocaleFromNavigator() : locale,
    });
}
