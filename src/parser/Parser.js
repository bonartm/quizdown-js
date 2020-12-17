const nearley = require('nearley');
const grammar = require('./grammar.js');
const { ParserRules } = require('./grammar.js');

// var test_string = `

// ### What's the capital of Germany?

// - [x] Berlin
// - [ ] Frankfurt
// - [ ] Paris
// - [ ] Cologne

// ### What's the capital of Germany?

// - [x] Berlin
// - [ ] Frankfurt
// - [ ] Paris
// - [ ] Cologne

// ### Please bring the following into order!

// 1. One
// 2. Two
// 3. Three
// 4. Four
// 5. Five

// ### Please assign a word to each concept!

// banana -> fruit
// apple -> fruit
// tomato -> vegetable
// kiwi -> fruit
// `

// parser.feed(test_string.trim())

// for (let block of parser.results[0]){
//     console.log(block['data']['question'])
//     for (let answer of block['data']['answers']){
//         console.log(answer)
//     }
// }

function parse(txt) {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(txt.trim());
    parser.finish();
    return parser.results[0];
}

module.exports = parse;
