import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import xml from 'highlight.js/lib/languages/xml';
import plaintext from 'highlight.js/lib/languages/plaintext';
import type { QuizdownExtension } from '../quizdown.js';

// this does not work....
// ['javascript', 'python', 'bash'].forEach(async (langName) => {
//     const langModule = await import(`highlight.js/lib/languages/${langName}`);
//     hljs.registerLanguage(langName, langModule);
// });

hljs.registerLanguage('python', python);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('plaintext', plaintext);

function highlighter(code, language) {
    const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
    return hljs.highlight(code, { language: validLanguage }).value;
}

let quizdownHighlight: QuizdownExtension = {
    setup: function (quizdown) {
        quizdown
            .get_marked_parser()
            .setOptions({ highlight: highlighter, langPrefix: 'hljs lang-' });
    },
};

export default quizdownHighlight;
