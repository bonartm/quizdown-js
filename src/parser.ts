import marked from 'marked';
import DOMPurify from 'dompurify';
import stripIndent from 'strip-indent';
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import plaintext from 'highlight.js/lib/languages/plaintext';
import {
    Quiz,
    BaseQuestion,
    MultipleChoice,
    SingleChoice,
    Sequence,
    Answer,
} from './quiz.js';

hljs.registerLanguage('python', python);
hljs.registerLanguage('plaintext', plaintext);

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

function html_decode(input) {
    // https://stackoverflow.com/questions/1912501/unescape-html-entities-in-javascript
    var doc = new DOMParser().parseFromString(input, 'text/html');
    return doc.documentElement.textContent;
}

function parse_quizdown(raw_quizdown: string): Quiz {
    let tokens = marked.lexer(html_decode(stripIndent(raw_quizdown)));
    let questions: Array<BaseQuestion> = [];
    let text: string = '';
    let explanation: string = '';
    let hint: string = '';

    console.log(tokens);

    // parse general options
    if (tokens[0]['type'] == 'paragraph') {
        console.log(tokens[0]);
    }

    tokens.forEach(function (el, i) {
        if (el['type'] == 'heading') {
            // start a new question
            explanation = '';
            hint = '';
            text = parse_tokens([el]);
            console.log(text);
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
                if (el['items'][0]['task']) {
                    // single choice list
                    questions.push(
                        new SingleChoice(text, explanation, hint, answers)
                    );
                } else {
                    // sequence list
                    questions.push(
                        new Sequence(text, explanation, hint, answers)
                    );
                }
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

export default parse_quizdown;
