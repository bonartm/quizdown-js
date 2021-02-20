import marked from 'marked';
import {
    Quiz,
    BaseQuestion,
    MultipleChoice,
    Sequence,
    Answer,
} from './quiz.js';
import hljs from 'highlight.js';
import App from './App.svelte';
import { decode } from 'he';
import DOMPurify from 'dompurify';
import stripIndent from 'strip-indent';

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

const init = function () {
    let nodes = document.querySelectorAll('.quizdown');
    for (let node of nodes) {
        let raw_quizdown = node.innerHTML;
        node.innerHTML = '';
        raw_quizdown = stripIndent(decode(raw_quizdown));
        new App({
            target: node,
            intro: false,
            props: {
                quiz: parse_quizdown(raw_quizdown),
            },
        });
    }
};

window.onload = init;

const quizdown = {
    init,
};
