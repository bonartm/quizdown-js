import marked from 'marked';
import {
    Quiz,
    BaseQuestion,
    MultipleChoice,
    Sequence,
    Answer,
} from './quiz.js';
import App from './App.svelte';
import DOMPurify from 'dompurify';
import stripIndent from 'strip-indent';
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import plaintext from 'highlight.js/lib/languages/plaintext';

hljs.registerLanguage('python', python);
hljs.registerLanguage('plaintext', plaintext);

import 'highlight.js/styles/github.css';

// this does not work....
// ['javascript', 'python', 'bash'].forEach(async (langName) => {
//     const langModule = await import(`highlight.js/lib/languages/${langName}`);
//     hljs.registerLanguage(langName, langModule);
// });

marked.setOptions({
    highlight: function (code, language) {
        const validLanguage = hljs.getLanguage(language)
            ? language
            : 'plaintext';
        return hljs.highlight(validLanguage, code).value;
    },
});

// customize renderer

const renderer = {
    // disable paragraph
    paragraph(text) {
        return text;
    },
    //disable blockquote
    blockquote(text) {
        return text;
    },
    //disable heading
    heading(text) {
        return text;
    },
};

// @ts-ignore
marked.use({ renderer });

function parse_tokens(tokens): string {
    return DOMPurify.sanitize(marked.parser(tokens));
}

function htmlDecode(input) {
    // https://stackoverflow.com/questions/1912501/unescape-html-entities-in-javascript
    var doc = new DOMParser().parseFromString(input, 'text/html');
    return doc.documentElement.textContent;
}

function parse_quizdown(raw_quizdown: string): Quiz {
    let tokens = marked.lexer(raw_quizdown);
    let questions: Array<BaseQuestion> = [];
    let text: string = '';
    let explanation: string = '';
    let hint: string = '';
    tokens.forEach(function (el, i) {
        if (el['type'] == 'heading') {
            // start a new question
            explanation = '';
            hint = '';
            text = parse_tokens([el]);
        }
        if (el['type'] == 'paragraph' || el['type'] == 'code') {
            explanation += parse_tokens([el]);
        }
        if (el['type'] == 'blockquote') {
            hint += parse_tokens([el]);
        }
        if (el['type'] == 'list') {
            let answers: Array<Answer> = [];
            el['items'].forEach(function (item, i) {
                let text: string = parse_tokens(item['tokens']);
                answers.push(new Answer(i, text, item['checked']));
            });
            if (el['ordered']) {
                // sequence list
                questions.push(new Sequence(text, explanation, hint, answers));
            } else {
                // multiple choice list
                questions.push(
                    new MultipleChoice(text, explanation, hint, answers)
                );
            }
        }
    });
    return new Quiz(questions);
}

export function create_app(raw_quizdown: string, node: Element) {
    node.innerHTML = '';
    raw_quizdown = htmlDecode(stripIndent(raw_quizdown));
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
