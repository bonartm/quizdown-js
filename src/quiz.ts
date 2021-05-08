import { writable, get, Writable } from 'svelte/store';
import autoBind from 'auto-bind';
import type { SvelteComponent } from 'svelte';
import type { Config } from './config.js';

export abstract class BaseQuestion {
    readonly text: string;
    readonly answers: Array<Answer>;
    readonly explanation: string;
    selected: Array<number> | number;
    solved: boolean;
    readonly hint: string;
    readonly type: string;
    readonly options: Config;

    static is_equal(a1: Array<number>, a2: Array<number>): boolean {
        return JSON.stringify(a1) === JSON.stringify(a2);
    }

    static shuffle(array: Array<any>): Array<any> {
        // https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
        let currentIndex = array.length,
            temporaryValue,
            randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }

    constructor(
        text: string,
        explanation: string,
        hint: string,
        answers: Array<Answer>,
        type: string,
        options: Config
    ) {
        if (answers.length === 0) {
            throw 'no answers for question provided';
        }
        this.text = text;
        this.explanation = explanation;
        this.hint = hint;
        this.solved = false;
        this.options = options;
        this.answers = answers;
        if (options['shuffle_answers']) {
            this.answers = BaseQuestion.shuffle(answers);
        }
        this.type = type;
        autoBind(this);
    }

    reset() {
        this.selected = [];
        this.solved = false;
        BaseQuestion.shuffle(this.answers);
    }

    abstract check(): void;
}

class Blanks extends BaseQuestion {
    check() {
        this.solved = false;
    }
}

class Pairs extends BaseQuestion {
    check() {
        this.solved = false;
    }
}

export class Sequence extends BaseQuestion {
    selected: Array<number>;

    constructor(
        text: string,
        explanation: string,
        hint: string,
        answers: Array<Answer>,
        options: Config
    ) {
        // always enable shuffling for sequence questions
        options['shuffle_answers'] = true;
        super(text, explanation, hint, answers, 'Sequence', options);
    }

    check() {
        // extract answer ids from answers
        let true_answer_ids = this.answers.map((answer) => answer.id);
        this.solved = BaseQuestion.is_equal(
            true_answer_ids.sort(),
            this.selected
        );
    }
}

export class MultipleChoice extends BaseQuestion {
    selected: Array<number>;

    constructor(
        text: string,
        explanation: string,
        hint: string,
        answers: Array<Answer>,
        options: Config
    ) {
        super(text, explanation, hint, answers, 'MultipleChoice', options);
        this.selected = [];
    }

    check() {
        let true_answer_ids = this.answers
            .map((answer, i) => i)
            .filter((i) => this.answers[i].correct);
        this.solved = BaseQuestion.is_equal(
            true_answer_ids.sort(),
            this.selected.sort()
        );
    }
}

export class SingleChoice extends BaseQuestion {
    selected: number;
    correct: number;

    constructor(
        text: string,
        explanation: string,
        hint: string,
        answers: Array<Answer>,
        options: Config
    ) {
        super(text, explanation, hint, answers, 'SingleChoice', options);
        let self = this;
        answers.forEach(function (answer, i) {
            if (answer.correct) {
                if (typeof self.correct !== 'undefined') {
                    throw 'Single choice question can only have one answer';
                }
                self.correct = i;
            }
        });
    }

    check() {
        this.solved = this.selected === this.correct;
    }
}

export class Answer {
    html: string;
    correct: boolean;
    id: number;

    constructor(id: number, html: string, correct: boolean) {
        this.html = html;
        this.correct = correct;
        this.id = id;
        autoBind(this);
    }
}

class Counter {
    val: Writable<number>;
    max: number;
    subscribe;

    constructor(max: number) {
        this.val = writable(0);
        this.max = max;
        this.subscribe = this.val.subscribe;
        autoBind(this);
    }

    jump(i: number) {
        this.val.set(i);
    }

    next() {
        this.val.update((val) => (val < this.max - 1 ? val + 1 : val));
    }

    previous() {
        this.val.update((val) => (val > 0 ? val - 1 : val));
    }

    reset() {
        // trigger a change
        if (get(this.val) == 0) this.val.set(1);
        this.val.set(0);
    }
}

export class Quiz {
    questions: Array<BaseQuestion>;
    counter: Counter;
    finished: Writable<boolean>;
    points: number;
    config: Config;

    constructor(questions, config) {
        if (questions.length == 0) {
            throw 'No questions for quiz provided';
        }
        this.questions = questions;
        this.counter = new Counter(this.questions.length);
        this.finished = writable(false);
        this.points = 0;
        this.config = config;
        if (config['shuffle_questions']) {
            this.questions = BaseQuestion.shuffle(questions);
        }

        autoBind(this);
    }

    current(): BaseQuestion {
        let n: number = get(this.counter);
        return this.questions[n];
    }

    next() {
        this.counter.next();
    }

    previous() {
        this.counter.previous();
    }

    jump(i: number) {
        this.counter.jump(i);
    }

    reset() {
        this.counter.reset();
        this.questions.forEach((q) => q.reset());
        this.finished.set(false);
    }

    evaluate() {
        this.finished.set(true);
        var points = 0;
        for (var q of this.questions) {
            q.check();
            if (q.solved) points++;
        }
        this.points = points;
        this.jump(this.counter.max);
    }
}
