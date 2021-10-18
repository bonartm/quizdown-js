import DOMPurify from 'dompurify';
import stripIndent from 'strip-indent';
import {
    Quiz,
    BaseQuestion,
    MultipleChoice,
    SingleChoice,
    Sequence,
    Answer,
    QuestionType,
} from './quiz';
import { Config, mergeAttributes } from './config';
import marked from './customizedMarked';

function parseQuizdown(rawQuizdown: string, globalConfig: Config): Quiz {
    let tokens = tokenize(rawQuizdown);
    // globalConfig < quizConfig < questionConfig
    let quizConfig = new Config(globalConfig);

    if (hasQuizOptions(tokens)) {
        quizConfig = parseOptions(tokens, quizConfig);
    }
    let firstHeadingIdx = findFirstHeadingIdx(tokens);
    let questions = extractQuestions(tokens.slice(firstHeadingIdx), quizConfig);
    return new Quiz(questions, quizConfig);
}

function tokenize(rawQuizdown: string): marked.TokensList {
    return marked.lexer(htmlDecode(stripIndent(rawQuizdown)));
}

function hasQuizOptions(tokens: marked.TokensList) {
    // type definition does not allow custom token types
    // @ts-ignore
    let optionsIdx = tokens.findIndex((token) => token['type'] == 'options');
    let headingIdx = tokens.findIndex((token) => token['type'] == 'heading');
    // quiz options appear at the top before the first heading
    return optionsIdx !== -1 && headingIdx > optionsIdx;
}

function parseOptions(tokens: marked.Token[], quizConfig: Config): Config {
    // type definition does not allow custom token types
    // @ts-ignore
    let options = tokens.find((token) => token.type == 'options');
    return mergeAttributes(quizConfig, options['data']);
}

function extractQuestions(tokens: marked.Token[], config: Config) {
    let questions: BaseQuestion[] = [];
    let nextQuestion = 0;

    while (tokens.length !== 0) {
        nextQuestion = findFirstHeadingIdx(tokens.slice(1));
        if (nextQuestion === -1) {
            // no next question on last question
            nextQuestion = tokens.length;
        }
        let question = parseQuestion(
            tokens.splice(0, nextQuestion + 1),
            config
        );
        questions.push(question);
    }
    return questions;
}

function parseQuestion(tokens: marked.Token[], config: Config): BaseQuestion {
    let explanation = parseExplanation(tokens);
    let hint = parseHint(tokens);
    let heading = parseHeading(tokens);
    let answers = parseAnswers(tokens);
    let questionType = determineQuestionType(tokens);
    let questionConfig = new Config(config);
    const args = [heading, explanation, hint, answers, questionConfig] as const;
    switch (questionType) {
        case 'SingleChoice':
            return new SingleChoice(...args);
        case 'MultipleChoice':
            return new MultipleChoice(...args);
        case 'Sequence':
            return new Sequence(...args);
    }
}

function findFirstHeadingIdx(tokens: marked.Token[]): number {
    return tokens.findIndex((token) => token['type'] == 'heading');
}

function parseHint(tokens: marked.Token[]): string {
    let blockquotes = tokens.filter((token) => token['type'] == 'blockquote');
    return parseTokens(blockquotes);
}

function parseExplanation(tokens: marked.Token[]): string {
    let explanations = tokens.filter(
        (token) => token['type'] == 'paragraph' || token['type'] == 'code'
    );
    return parseTokens(explanations);
}

function parseHeading(tokens: marked.Token[]): string {
    let headings = tokens.filter((token) => token['type'] == 'heading');
    return parseTokens(headings);
}

function parseAnswers(tokens: marked.Token[]): Array<Answer> {
    let list = tokens.find(
        (token) => token.type == 'list'
    ) as marked.Tokens.List;
    let answers: Array<Answer> = [];
    list.items.forEach(function (item, i) {
        let answer = parseAnswer(item);
        answers.push(
            new Answer(i, answer['text'], item['checked'], answer['comment'])
        );
    });
    return answers;
}

function parseAnswer(item: marked.Tokens.ListItem) {
    let comments = item['tokens'].filter((token) => token.type == 'blockquote');
    let texts = item['tokens'].filter((token) => token.type != 'blockquote');
    return { text: parseTokens(texts), comment: parseTokens(comments) };
}

function determineQuestionType(tokens: marked.Token[]): QuestionType {
    let list = tokens.find(
        (token) => token.type == 'list'
    ) as marked.Tokens.List;
    if (list.ordered) {
        if (list.items[0].task) {
            return 'SingleChoice';
        } else {
            return 'Sequence';
        }
    } else {
        return 'MultipleChoice';
    }
}

function parseTokens(tokens: marked.Token[]): string {
    return DOMPurify.sanitize(marked.parser(tokens as marked.TokensList));
}

function htmlDecode(text: string) {
    return text
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
}

export default parseQuizdown;
