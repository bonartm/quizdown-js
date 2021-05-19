import marked from 'marked';
import highlight from './highlight.js';
import { parse as parse_yaml } from 'yaml';
import katex from 'katex';

marked.setOptions({ highlight: highlight });

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
                data: parse_yaml(cap[3], {}),
            };
        }
    },
};

// customize renderer

// match math formulas and render w katex
function maths_expression(expr: string, display_mode: boolean) {
    // $...$ or &&...&& but not $...$$
    const regex = RegExp(/^(\${1,2})((?:\\.|[\s\S])*)\1$/);
    const cap = regex.exec(expr);
    if (cap) {
        return katex.renderToString(cap[2], {
            displayMode: display_mode,
        });
    }
}

const renderer = {
    // disable paragraph
    paragraph(text) {
        return text;
    },
    //disable blockquote, we use this for hints
    blockquote(text) {
        return text;
    },
    //disable heading, we only use h3 headings
    heading(text) {
        return text;
    },
    // math rendering inside code blocks
    code(code, lang, escaped) {
        if (!lang) {
            const math = maths_expression(code, true);
            if (math) {
                return math;
            }
        }
        // use default renderer
        return false;
    },

    // math rendering inside inline code
    codespan(text) {
        const math = maths_expression(text, false);
        if (math) {
            return math;
        }
        // use default renderer
        return false;
    },
};

// @ts-ignore
marked.use({ renderer, tokenizer });

export default marked;
