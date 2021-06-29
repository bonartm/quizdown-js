import DOMPurify from 'dompurify';
import stripIndent from 'strip-indent';
import {
    Quiz,
    BaseQuestion,
    MultipleChoice,
    SingleChoice,
    Sequence,
    Answer,
} from './quiz.js';
import { Config, merge_attributes } from './config.js';
import marked from './customizedMarked.js';

function parse_tokens(tokens): string {
    return DOMPurify.sanitize(marked.parser(tokens));
}

function html_decode(input) {
    return input
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
}

function parse_answer(item) {
    let text = '';
    let comment = '';
    item['tokens'].forEach(function (token, i) {
        if (token['type'] == 'blockquote') {
            comment += parse_tokens([token]);
        } else {
            text += parse_tokens([token]);
        }
    });
    return { text: text, comment: comment };
}

function parse_quizdown(raw_quizdown: string, global_config: Config): Quiz {
    let tokens = marked.lexer(html_decode(stripIndent(raw_quizdown)));
    let questions: Array<BaseQuestion> = [];
    let header: string = '';
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
            header = parse_tokens([el]);
            question_config = new Config(quiz_config);
            before_first = false;
        }
        // type definition does not allow custom token types
        // @ts-ignore
        if (el['type'] == 'options') {
            if (before_first) {
                // comes before the first heading: quiz config
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
                let answer = parse_answer(item);
                answers.push(
                    new Answer(
                        i,
                        answer['text'],
                        item['checked'],
                        answer['comment']
                    )
                );
            });
            if (el['ordered']) {
                if (el['items'][0]['task']) {
                    // single choice list
                    questions.push(
                        new SingleChoice(
                            header,
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
                            header,
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
                        header,
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
