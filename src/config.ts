function get(attr, def) {
    return typeof attr != 'undefined' ? attr : def;
}

export class Config {
    start_on_load: boolean;
    shuffle_answers: boolean;
    shuffle_questions: boolean;
    primary_color: string;
    secondary_color: string;
    text_color: string;
    video_id: string;
    start_seconds: number;
    end_seconds: number;
    locale: 'de' | 'en' | 'es' | 'fr' | null;

    constructor(options) {
        this.start_on_load = get(options.start_on_load, true);
        this.shuffle_answers = get(options.shuffle_answers, true);
        this.shuffle_questions = get(options.shuffle_questions, false);
        this.primary_color = get(options.primary_color, 'steelblue');
        this.secondary_color = get(options.secondary_color, '#f2f2f2');
        this.text_color = get(options.text_color, 'black');
        this.locale = get(options.locale, null);
        this.video_id = get(options.video_id, null);
        this.start_seconds = get(options.start_seconds, null);
        this.end_seconds = get(options.end_seconds, null);
    }
}

export function merge_attributes(
    base_config: Config,
    new_config: Config
): Config {
    //new_config overwrites entries in config1
    let config = new Config(base_config);
    for (let attrname in new_config) {
        if (Object.prototype.hasOwnProperty.call(new_config, attrname)) {
            config[attrname] = new_config[attrname];
        }
    }
    return config;
}
