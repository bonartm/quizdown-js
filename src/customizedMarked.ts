import marked from 'marked';
import { parse as parseYaml } from 'yaml';

// customize tokenizer to include yaml like header blocks
const tokenizer: marked.TokenizerObject = {
    // type definition does no allow custom token type
    // @ts-ignore
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
                data: parseYaml(cap[3], {}),
            };
        }
    },
};

// customize renderer
const renderer: marked.RendererObject = {
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

marked.use({
    renderer: renderer,
    // type definition does not allow custom token type
    // @ts-ignore
    tokenizer: tokenizer,
});

export default marked;
