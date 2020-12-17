import { decode } from 'he';
import Parser from './parser/Parser.js';
import Quiz from './app/Quiz.svelte';
import uuidv4 from 'uuid';

const init = function () {
    let nodes = document.querySelectorAll('.quizdown');
    for (let node of nodes) {
        const txt = decode(node.innerHTML);
        node.innerHTML = '';
        var quiz_data = Parser(txt);
        node.dataset.uuid = uuidv4();
        new Quiz({
            target: node,
            intro: false,
            props: {
                quiz_data: quiz_data,
            },
        });
    }
};

window.addEventListener(
    'load',
    function () {
        init();
    },
    false
);

const quizdown = {
    init,
};

export default quizdown;
