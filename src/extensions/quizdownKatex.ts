import katex from 'katex';

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
        quizdown.marked.use({
            extensions: [extension],
        });
    },
};
