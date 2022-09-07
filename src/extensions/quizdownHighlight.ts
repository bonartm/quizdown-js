import hljs from 'highlight.js/lib/core';
import bash from 'highlight.js/lib/languages/bash';
import batch from 'highlight.js/lib/languages/dos';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import plaintext from 'highlight.js/lib/languages/plaintext';
import python from 'highlight.js/lib/languages/python';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import type { QuizdownExtension } from '../quizdown.js';

// this does not work....
// ['javascript', 'python', 'bash'].forEach(async (langName) => {
//     const langModule = await import(`highlight.js/lib/languages/${langName}`);
//     hljs.registerLanguage(langName, langModule);
// });

hljs.registerLanguage('bash', bash);
hljs.registerLanguage('batch', batch);
hljs.registerLanguage('java', java);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('plaintext', plaintext);
hljs.registerLanguage('python', python);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('html', xml);

function highlighter(code, language) {
    const validLanguage = hljs.getLanguage(language) ? language : 'plaintext';
    return hljs.highlight(code, { language: validLanguage }).value;
}

let quizdownHighlight: QuizdownExtension = {
    setup: function (quizdown) {
        quizdown
            .getMarkedParser()
            .setOptions({ highlight: highlighter, langPrefix: 'hljs lang-' });
    },
};

export default quizdownHighlight;
