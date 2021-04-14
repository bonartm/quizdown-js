import App from './App.svelte';
import parse_quizdown from './parser.js';
import { Config } from './config.js';

export function create_app(
    raw_quizdown: string,
    node: Element,
    config: Config
) {
    node.innerHTML = '';
    try {
        let quiz = parse_quizdown(raw_quizdown, config);
        new App({
            target: node,
            intro: false,
            props: {
                quiz: quiz,
            },
        });
    } catch (e) {
        node.innerHTML = `${e}. App could not render. Please check your quizdown syntax.`;
    }
}

export function init(config = {}) {
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
