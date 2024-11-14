function get(attr, def) {
    return typeof attr != 'undefined' ? attr : def;
}

function renameProp(oldprop: string, newprop: string, obj: object) {
    if (oldprop in obj) {
        obj[newprop] = obj[oldprop];
    }
}

const toRename = {
    start_on_load: 'startOnLoad',
    shuffle_answers: 'shuffleAnswers',
    shuffle_questions: 'shuffleQuestions',
    primary_color: 'primaryColor',
    secondary_color: 'secondaryColor',
    text_color: 'textColor',
    enable_retry: 'enableRetry'
};

export class Config {
    startOnLoad: boolean;
    shuffleAnswers: boolean;
    shuffleQuestions: boolean;
    nQuestions: number | undefined;
    primaryColor: string;
    secondaryColor: string;
    textColor: string;
    passingGrade: number | undefined;
    customPassMsg: string;
    customFailMsg: string;
    locale: 'de' | 'en' | 'es' | 'fr' | null;
    enableRetry: boolean;
    customStyleSheet: string;

    constructor(options: Config | object) {
        // handle <=v0.3.0 snake_case options for backwards compatibility
        for (const oldName in toRename) {
            renameProp(oldName, toRename[oldName], options);
        }
        this.startOnLoad = get(options['startOnLoad'], true);
        this.shuffleAnswers = get(options['shuffleAnswers'], true);
        this.shuffleQuestions = get(options['shuffleQuestions'], false);
        this.nQuestions = get(options['nQuestions'], undefined);
        this.primaryColor = get(options['primaryColor'], 'steelblue');
        this.secondaryColor = get(options['secondaryColor'], '#f2f2f2');
        this.textColor = get(options['textColor'], 'black');
        this.passingGrade = get(options['passingGrade'], undefined);
        this.customPassMsg = get(options['customPassMsg'], 'You have passed!');
        this.customFailMsg = get(options['customFailMsg'], 'You have not passed');
        this.locale = get(options['locale'], null);
        this.enableRetry = get(options['enableRetry'],true);
        this.customStyleSheet = get(options['customStyleSheet'], 'customQuizdown.css');
    }
}

export function mergeAttributes(baseConfig: Config, newConfig: Config): Config {
    //newConfig overwrites entries in baseConfig
    let config = new Config(baseConfig);
    for (let attrname in newConfig) {
        if (Object.prototype.hasOwnProperty.call(newConfig, attrname)) {
            config[attrname] = newConfig[attrname];
        }
    }
    return config;
}
