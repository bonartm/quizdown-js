function get(attr, def) {
    return typeof attr != 'undefined' ? attr : def;
}

export class Config {
    start_on_load: boolean;
    shuffle_answers: boolean;
    shuffle_questions: boolean;
    primary_color: string;
    secondary_color: string;
    title_color: string;

    constructor(options) {
        this.start_on_load = get(options.start_on_load, true);
        this.shuffle_answers = get(options.shuffle_answers, true);
        this.shuffle_questions = get(options.shuffle_questions, false);
        this.primary_color = get(options.primary_color, '#FF851B');
        this.secondary_color = get(options.secondary_color, '#DDDDDD');
        this.title_color = get(options.title_color, 'black');
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
