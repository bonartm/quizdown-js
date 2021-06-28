import App from './App.svelte';
import parse_quizdown from './parser.js';
import { Config } from './config.js';
import marked from './customized_marked.js';

function register(extension) {
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

export default {
    init,
    register,
    create_app,
    marked,
};
