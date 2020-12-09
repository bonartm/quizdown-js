import { decode } from 'he';
import Parser from './parser/Parser.js';
import Quiz from './app/Quiz.svelte';


const init = function() {
    let nodes = document.querySelectorAll('.quizzy');
    for (let node of nodes) {        
        const txt = decode(node.innerHTML);
        node.innerHTML = '';  
        var quiz_data = Parser(txt)   
        console.log(quiz_data)
        let quiz = new Quiz({
            target: node,
            props: {
                quiz_data: quiz_data
            }
        });
    }
}

window.addEventListener(
    'load',
    function() {
      init();
    },
    false
);

const quizzy = {
    init
};

export default quizzy;
