// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
 
function to_dict([question, answers], type){
    return {"type":type,"data":{"question":question, "answers":answers}}
}

function array_to_dict(items){
    var result = {};
    for (let item of items){
        result[item[0]] = item[1]; 
    }
    return result;
}
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "quiz$ebnf$1", "symbols": ["block"]},
    {"name": "quiz$ebnf$1", "symbols": ["quiz$ebnf$1", "block"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "quiz", "symbols": ["quiz$ebnf$1"], "postprocess": id},
    {"name": "block", "symbols": ["multiple_choice"], "postprocess": id},
    {"name": "block", "symbols": ["sequence"], "postprocess": id},
    {"name": "block", "symbols": ["pairs"], "postprocess": id},
    {"name": "multiple_choice", "symbols": ["question", "task_list"], "postprocess": (data) => to_dict(data, "multiple-choice")},
    {"name": "task_list$ebnf$1", "symbols": ["task_list_entry"]},
    {"name": "task_list$ebnf$1", "symbols": ["task_list$ebnf$1", "task_list_entry"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "task_list", "symbols": ["task_list$ebnf$1"], "postprocess": id},
    {"name": "task_list_entry$subexpression$1", "symbols": ["right"]},
    {"name": "task_list_entry$subexpression$1", "symbols": ["wrong"]},
    {"name": "task_list_entry", "symbols": ["task_list_entry$subexpression$1", "string", "_"], "postprocess": ([is_right, string, _]) => ({"is_right": is_right, "text": string})},
    {"name": "right$string$1", "symbols": [{"literal":"-"}, {"literal":" "}, {"literal":"["}, {"literal":"x"}, {"literal":"]"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "right", "symbols": ["right$string$1"], "postprocess": ([right]) => true},
    {"name": "wrong$string$1", "symbols": [{"literal":"-"}, {"literal":" "}, {"literal":"["}, {"literal":" "}, {"literal":"]"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "wrong", "symbols": ["wrong$string$1"], "postprocess": ([wrong]) => false},
    {"name": "sequence", "symbols": ["question", "ordered_list"], "postprocess": (data) => to_dict(data, "sequence")},
    {"name": "ordered_list$ebnf$1", "symbols": ["ordered_list_entry"]},
    {"name": "ordered_list$ebnf$1", "symbols": ["ordered_list$ebnf$1", "ordered_list_entry"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ordered_list", "symbols": ["ordered_list$ebnf$1"]},
    {"name": "ordered_list_entry", "symbols": ["digit", "string", "_"], "postprocess": ([digit, string, _]) => string},
    {"name": "pairs", "symbols": ["question", "pair_list"], "postprocess": (data) => to_dict(data, "pairs")},
    {"name": "pair_list$ebnf$1", "symbols": ["pair_entry"]},
    {"name": "pair_list$ebnf$1", "symbols": ["pair_list$ebnf$1", "pair_entry"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "pair_list", "symbols": ["pair_list$ebnf$1"], "postprocess": ([entries]) => [array_to_dict(entries)]},
    {"name": "pair_entry$string$1", "symbols": [{"literal":"-"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "pair_entry", "symbols": ["string", "pair_entry$string$1", "string", "_"], "postprocess": ([key, arrow, value, ws]) => [key, value]},
    {"name": "question", "symbols": ["header", "string", "_"], "postprocess": ([header, string, _]) => string},
    {"name": "header$ebnf$1", "symbols": [/[#]/]},
    {"name": "header$ebnf$1", "symbols": ["header$ebnf$1", /[#]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "header", "symbols": ["header$ebnf$1"], "postprocess": (chars) => null},
    {"name": "string$ebnf$1", "symbols": []},
    {"name": "string$ebnf$1", "symbols": ["string$ebnf$1", /[^\n#]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "string", "symbols": ["string$ebnf$1"], "postprocess": ([chars]) => chars.join("").trim()},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", "wschar"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": (d) => null},
    {"name": "wschar", "symbols": [/[ \t\n\v\f]/], "postprocess": id},
    {"name": "digit$string$1", "symbols": [{"literal":"."}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "digit", "symbols": [/[\d]/, "digit$string$1"], "postprocess": id}
]
  , ParserStart: "quiz"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
