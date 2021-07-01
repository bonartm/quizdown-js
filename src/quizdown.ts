import App from './App.svelte';
import parseQuizdown from './parser.js';
import { Config } from './config.js';
import marked from './customizedMarked.js';

export interface Quizdown {
    register(extension: QuizdownExtension): void;
    createApp(rawQuizdown: string, node: Element, config: Config): void;
    init(config: object): void;
    getMarkedParser(): typeof marked;
}

export interface QuizdownExtension {
    setup(quizdown: Quizdown): void;
}

function register(extension: QuizdownExtension) {
    extension.setup(this);
    return this;
}

function createApp(rawQuizdown: string, node: Element, config: Config): void {
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
        let quiz = parseQuizdown(rawQuizdown, config);
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

function init(config: object = {}): void {
    let globalConfig = new Config(config);
    if (globalConfig.startOnLoad) {
        if (typeof document !== 'undefined') {
            window.addEventListener(
                'load',
                function () {
                    let nodes = document.querySelectorAll('.quizdown');
                    for (let node of nodes) {
                        createApp(node.innerHTML, node, globalConfig);
                    }
                },
                false
            );
        }
    }
}

function getMarkedParser(): typeof marked {
    return marked;
}

let quizdown: Quizdown = {
    init,
    register,
    createApp,
    getMarkedParser,
};

export default quizdown;
