import marked from 'marked';
import DOMPurify from 'dompurify';
import stripIndent from 'strip-indent';
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import plaintext from 'highlight.js/lib/languages/plaintext';
import YAML from 'yaml';
import {
    Quiz,
    BaseQuestion,
    MultipleChoice,
    SingleChoice,
    Sequence,
    Answer,
} from './quiz.js';
import { Config, merge_attributes } from './config.js';

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
        return hljs.highlight(code, { language: validLanguage }).value;
    },
});

// customize tokenizer to include yaml like header blocks

const tokenizer = {
    hr(src) {
        //adapted from https://github.com/markedjs/marked/blob/master/src/rules.js
        const regex = RegExp(
            /^ {0,3}(-{3,}(?=[^-\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~-]* *(?:\n+|$)|$)/
        );
        const cap = regex.exec(src);
        if (cap) {
            return {
                type: 'options',
                raw: cap[0],
                data: YAML.parse(cap[3], {}),
            };
        }
    },
};

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
marked.use({ renderer, tokenizer });

function parse_tokens(tokens): string {
    return DOMPurify.sanitize(marked.parser(tokens));
}

function html_decode(input) {
    // https://stackoverflow.com/questions/1912501/unescape-html-entities-in-javascript
    var doc = new DOMParser().parseFromString(input, 'text/html');
    return doc.documentElement.textContent;
}

function parse_quizdown(raw_quizdown: string, global_config: Config): Quiz {
    let tokens = marked.lexer(html_decode(stripIndent(raw_quizdown)));
    let questions: Array<BaseQuestion> = [];
    let text: string = '';
    let explanation: string = '';
    let hint: string = '';
    let before_first: boolean = true;
    // global_config < quiz_config < question_config
    let quiz_config = new Config(global_config);
    let question_config: Config;

    tokens.forEach(function (el, i) {
        if (el['type'] == 'heading') {
            // start a new question
            explanation = '';
            hint = '';
            text = parse_tokens([el]);
            question_config = new Config(quiz_config);
            before_first = false;
        }

        if (el['type'] == 'options') {
            if (before_first) {
                // comes before the first heading: quiz config
                console.log(el['data']);
                quiz_config = merge_attributes(quiz_config, el['data']);
            } else {
                // comes after a heading: question config
                question_config = merge_attributes(quiz_config, el['data']);
            }
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
                let textWithComment: string[] = parse_tokens(item['tokens']).split("&gt;\n");
                let text: string = textWithComment[0].trim();
                let comment: string = textWithComment.length > 1 ? textWithComment[1].trim() : null;

                answers.push(new Answer(i, text, item['checked'], comment));
            });
            if (el['ordered']) {
                if (el['items'][0]['task']) {
                    // single choice list
                    questions.push(
                        new SingleChoice(
                            text,
                            explanation,
                            hint,
                            answers,
                            question_config
                        )
                    );
                } else {
                    // sequence list
                    questions.push(
                        new Sequence(
                            text,
                            explanation,
                            hint,
                            answers,
                            question_config
                        )
                    );
                }
            } else {
                // multiple choice list
                questions.push(
                    new MultipleChoice(
                        text,
                        explanation,
                        hint,
                        answers,
                        question_config
                    )
                );
            }
        }
    });
    return new Quiz(questions, quiz_config);
}

export default parse_quizdown;
