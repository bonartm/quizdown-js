# nearley grammar for quizzly

@{% 
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
%}

quiz -> block:+                                 {% id %}

block ->
      multiple_choice                           {% id %}
    | sequence                                  {% id %}
    | pairs                                     {% id %}


## multiple choice
multiple_choice -> question task_list           {% (data) => to_dict(data, "multiple-choice") %}
task_list -> task_list_entry:+                  {% id %}
task_list_entry -> (right | wrong) string _     {% ([is_right, string, _]) => ({"is_right": is_right, "text": string}) %}
right -> "- [x]"                                {% ([right]) => true %}
wrong -> "- [ ]"                                {% ([wrong]) => false %}

## sequence
sequence -> question ordered_list               {% (data) => to_dict(data, "sequence") %}
ordered_list -> ordered_list_entry:+            
ordered_list_entry -> digit string _            {% ([digit, string, _]) => string %}

## pairs
pairs -> question pair_list                     {% (data) => to_dict(data, "pairs") %}
pair_list -> pair_entry:+                       {% ([entries]) => [array_to_dict(entries)]  %}
pair_entry -> string "->" string _              {% ([key, arrow, value, ws]) => [key, value] %}

## shared rules
question -> header string _                     {% ([header, string, _]) => string %}
header -> [#]:+                                {% (chars) => null %}
string   -> [^\n#]:*                           {% ([chars]) => chars.join("").trim() %}
_  -> wschar:*                                  {% (d) => null %}
wschar -> [ \t\n\v\f]                           {% id %}
digit -> [\d] ". "                              {% id %}
