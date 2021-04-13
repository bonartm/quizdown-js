import App from './App.svelte';
import parse_quizdown from './parser.js';
export function create_app(raw_quizdown: string, node: Element) {
    node.innerHTML = '';
    try {
        let quiz = parse_quizdown(raw_quizdown);
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

export function init() {
    let nodes = document.querySelectorAll('.quizdown');
    for (let node of nodes) {
        create_app(node.innerHTML, node);
    }
}

window.onload = init;
