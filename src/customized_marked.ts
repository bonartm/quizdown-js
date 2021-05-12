import marked from 'marked';
import highlight from './highlight.js';
import YAML from 'yaml';

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
    //disable blockquote, we use this for hints
    blockquote(text) {
        return text;
    },
    //disable heading, we only use h3 headings
    heading(text) {
        return text;
    },
};

// @ts-ignore
marked.use({ renderer, tokenizer });

export default marked;
