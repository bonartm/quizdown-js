import App from './App.svelte';
import parse_quizdown from './parser.js';
export function create_app(raw_quizdown: string, node: Element, id: String) {
    node.innerHTML = '';
    try {
        let { quiz, options } = parse_quizdown(raw_quizdown);
        new App({
            target: node,
            intro: false,
            props: {
                quiz: quiz,
                id: id,
                options: options,
            },
        });
    } catch (e) {
        node.innerHTML = `${e}. App could not render. Please check your quizdown syntax.`;
    }
}

function guidGenerator(): String {
    var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return (
        S4() +
        S4() +
        '-' +
        S4() +
        '-' +
        S4() +
        '-' +
        S4() +
        '-' +
        S4() +
        S4() +
        S4()
    );
}

export function init() {
    let nodes = document.querySelectorAll('.quizdown');
    for (let node of nodes) {
        create_app(node.innerHTML, node, guidGenerator());
    }
}

window.onload = init;
