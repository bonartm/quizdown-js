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
import { Config, mergeAttributes } from './config.js';
import marked from './customizedMarked.js';

function parseTokens(tokens): string {
    return DOMPurify.sanitize(marked.parser(tokens));
}

function htmlDecode(input) {
    return input
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
}

function parseAnswer(item) {
    let text = '';
    let comment = '';
    item['tokens'].forEach(function (token, i) {
        if (token['type'] == 'blockquote') {
            comment += parseTokens([token]);
        } else {
            text += parseTokens([token]);
        }
    });
    return { text: text, comment: comment };
}

function parseQuizdown(rawQuizdown: string, globalConfig: Config): Quiz {
    let tokens = marked.lexer(htmlDecode(stripIndent(rawQuizdown)));
    let questions: Array<BaseQuestion> = [];
    let header: string = '';
    let explanation: string = '';
    let hint: string = '';
    let beforeFirst: boolean = true;
    // globalConfig < quizConfig < questionConfig
    let quizConfig = new Config(globalConfig);
    let questionConfig: Config;

    tokens.forEach(function (el, i) {
        if (el['type'] == 'heading') {
            // start a new question
            explanation = '';
            hint = '';
            header = parseTokens([el]);
            questionConfig = new Config(quizConfig);
            beforeFirst = false;
        }
        // type definition does not allow custom token types
        // @ts-ignore
        if (el['type'] == 'options') {
            if (beforeFirst) {
                // comes before the first heading: quiz config
                quizConfig = mergeAttributes(quizConfig, el['data']);
            } else {
                // comes after a heading: question config
                questionConfig = mergeAttributes(quizConfig, el['data']);
            }
        }

        if (el['type'] == 'paragraph' || el['type'] == 'code') {
            explanation += parseTokens([el]);
        }

        if (el['type'] == 'blockquote') {
            hint += parseTokens([el]);
        }

        if (el['type'] == 'list') {
            let answers: Array<Answer> = [];
            el['items'].forEach(function (item, i) {
                let answer = parseAnswer(item);
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
                            questionConfig
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
                            questionConfig
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
                        questionConfig
                    )
                );
            }
        }
    });
    return new Quiz(questions, quizConfig);
}

export default parseQuizdown;
