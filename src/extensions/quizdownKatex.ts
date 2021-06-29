import katex from 'katex';
import type { QuizdownExtension } from '../quizdown.js';

interface KatexToken {
    type: 'katex',
    raw: string,
    formula: string,
    displayMode: boolean
}

const rule = RegExp(/^(\$+)([^\$]|[^\$][\s\S]*?[^\$])\1(?!\$)/);

let markedExtension = {
    name: 'katex',
    level: 'inline',
    start(src): number {
        let idx: number = src.match(/(\$){1,2}/)?.index;
        return idx;
    },
    tokenizer(src): KatexToken | undefined {
        const match = rule.exec(src);
        if (match) {
            return {
                type: 'katex',
                raw: match[0],
                formula: match[2].trim(),
                displayMode: match[1] === '$$',
            };
        }
    },
    renderer(token: KatexToken) {
        return katex.renderToString(token.formula, {
            displayMode: token.displayMode,
        });
    },
};

let quizdownKatex: QuizdownExtension = {
    setup: function (quizdown) {
        // type definition seems outdated, because this is the correct usage
        // @ts-ignore
<<<<<<< HEAD
        quizdown.get_marked_parser().use({ extensions: [markedExtension] });
=======
        marked.use({ extensions: [markedExtension] });
>>>>>>> 824810a... setup type definitions
    },
};

export default quizdownKatex;
