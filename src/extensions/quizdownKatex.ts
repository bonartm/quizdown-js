import katex from 'katex';
import type { QuizdownExtension } from '../quizdown.js';

const rule = RegExp(/^(\$+)([^\$]|[^\$][\s\S]*?[^\$])\1(?!\$)/);

let extension = {
    name: 'katex',
    level: 'inline',
    start(src) {
        let idx = src.match(/(\$){1,2}/)?.index;
        return idx;
    },
    tokenizer(src) {
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
    renderer(token) {
        return katex.renderToString(token.formula, {
            displayMode: token.displayMode,
        });
    },
};

export default {
    setup: function (quizdown) {
        // type definition seems outdated, because this is the correct usage
        // @ts-ignore
        quizdown.get_marked_parser().use({ extensions: [markedExtension] });
    },
};
