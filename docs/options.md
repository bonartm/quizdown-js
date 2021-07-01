# Options

Options can be set globally, per quiz or even per question. Options on the quiz level overwrite global options. 

## Setting global options

Currently, the following options are supported. Shown are the default settings:

```typescript
let config = {
	startOnLoad: true,		 // detect and convert all divs with class quizdown
    shuffleAnswers: true,		 // shuffle answers for each question
    shuffleQuestions: false,    // shuffle questsions for each quiz
    primaryColor: 'steelblue',  // primary CSS color
    secondaryColor: '#f2f2f2',  // secondary CSS color
    textColor: 'black',         // text color of some elements
    locale: null                 // language of the user interface (auto-detect per default)
};

quizdown.init(config);
```

## Language settings

If `locale: null` the language is fetched from the browser's settings.
Otherwise locale can be set globally to `en`, `fr`, `es` or `de`. 

## Setting quiz and question specific options

- Quiz and question specific options can be set inside the quizdown using YAML headers.
- Only the option `shuffleAnswers` can be used on a question level. 
- The answers for sequence questions are always shuffled.


Here is an example ([🚀 editor](https://bonartm.github.io/quizdown-live-editor/?code=---%0AprimaryColor%3A%20%27%23FF851B%27%0AsecondaryColor%3A%20%27%23DDDDDD%27%0AtextColor%3A%20black%0Alocale%3A%20de%0A---%0A%0A%23%20What%20is%20the%20capital%20of%20Berlin%3F%0A%0A---%0AshuffleAnswers%3A%20false%0A---%0A%0AIn%20this%20question%20you%20are%20asked%20a%20**very**%20difficult%20question.%0A%0A%3E%20Do%20some%20research!%0A%0A-%20%5Bx%5D%20Berlin%0A-%20%5B%20%5D%20Stuttgart%0A-%20%5B%20%5D%20Cologne%0A-%20%5B%20%5D%20D%C3%BCsseldorf)):

```markdown
---
primaryColor: '#FF851B'
secondaryColor: '#DDDDDD'
textColor: black
locale: de
---

# What is the capital of Berlin?

---
shuffleAnswers: false
---

In this question you are asked a **very** difficult question.

> Do some research!

- [x] Berlin
- [ ] Stuttgart
- [ ] Cologne
- [ ] Düsseldorf
```
