import App from './App.svelte';
import parse_quizdown from './parser.js';
import { Config } from './config.js';
import marked from './customizedMarked.js';

export interface Quizdown {
    register(extension: QuizdownExtension): void;
    create_app(raw_quizdown: string, node: Element, config: Config): void;
    init(config: object): void;
    get_marked_parser(): typeof marked;
}

export interface QuizdownExtension {
    setup(quizdown: Quizdown): void;
}

function register(extension: QuizdownExtension) {
    extension.setup(this);
    return this;
}

function create_app(raw_quizdown: string, node: Element, config: Config) {
    node.innerHTML = '';
    let root: ShadowRoot;
    if (!!node.shadowRoot) {
        //clear root if it allready exists
        root = node.shadowRoot;
        root.innerHTML = '';
    } else {
        root = node.attachShadow({ mode: 'open' });
    }
    try {
        let quiz = parse_quizdown(raw_quizdown, config);
        new App({
            // https://github.com/sveltejs/svelte/pull/5870
            target: root,
            intro: false,
            props: {
                quiz: quiz,
            },
        });
    } catch (e) {
        root.innerHTML = `${e}. App could not render. Please check your quizdown syntax.`;
    }
}

function init(config = {}) {
    let global_config = new Config(config);
    if (global_config.start_on_load) {
        if (typeof document !== 'undefined') {
            window.addEventListener(
                'load',
                function () {
                    let nodes = document.querySelectorAll('.quizdown');
                    for (let node of nodes) {
                        create_app(node.innerHTML, node, global_config);
                    }
                },
                false
            );
        }
    }
}

function get_marked_parser(): typeof marked {
    return marked;
}

let quizdown: Quizdown = {
    init,
    register,
    create_app,
    get_marked_parser,
};
