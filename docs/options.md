# Options

Options can be set globally, per quiz or per question. Options on the quiz level overwrite global options. Options on the question level overwrite quiz options.

## Setting global options

Currently, the following options are supported. Shown are the default settings:

```typescript
let config = {
    startOnLoad: true,          // detect and convert all div html elements with class quizdown
    shuffleAnswers: true,       // shuffle answers for each question
    shuffleQuestions: false,    // shuffle questions for each quiz
    nQuestions: undefined       // display n questions at random, if shuffleQuestions is true
    primaryColor: 'steelblue',  // primary CSS color
    secondaryColor: '#f2f2f2',  // secondary CSS color
    textColor: 'black',         // text color of some elements
    locale: null                // language of the user interface (auto-detect per default)
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

## Shuffling

Setting `shuffleQuestions: true` will shuffle questions on every *page reload*. When clicking the reload button in the quiz app no shuffling is applied.

If shuffling is enabled, `nQuestions` can be set to a positive number. It can be used to select 
a random sample from the pool of questions. Sampling will only be applied on every *page reload*. 


Here is an example ([🚀 editor](https://bonartm.github.io/quizdown-live-editor/?code=---%0AprimaryColor%3A%20%27%23FF851B%27%0AsecondaryColor%3A%20%27%23DDDDDD%27%0AtextColor%3A%20black%0Alocale%3A%20de%0A---%0A%0A%23%20What%20is%20the%20capital%20of%20Berlin%3F%0A%0A---%0AshuffleAnswers%3A%20false%0A---%0A%0AIn%20this%20question%20you%20are%20asked%20a%20**very**%20difficult%20question.%0A%0A%3E%20Do%20some%20research!%0A%0A-%20%5Bx%5D%20Berlin%0A-%20%5B%20%5D%20Stuttgart%0A-%20%5B%20%5D%20Cologne%0A-%20%5B%20%5D%20D%C3%BCsseldorf)):

```markdown
---
primaryColor: '#FF851B'
secondaryColor: '#DDDDDD'
textColor: black
locale: de
shuffleQuestions: true
nQuestions: 2
---

#### What's the value of $x$?

This is what i mean:
$$
x=\sqrt{\frac{9}{16}}
$$

> Also check out $\sqrt{x+2}$!

1. [x] Try out: $x=0.75$
1. [ ] $x=0.5$ could also *be correct*!
1. [ ] perhaps $x=1$?
1. [ ] $x=1.5$

#### What's the value of `x[3]`?

---
shuffleAnsers: false
---

```python
# a python list
x = [1, 2, 3, 4]
```

- [ ] 1
- [ ] 2
- [ ] 3
- [x] 4

#### Who is the person in the picture?

![](https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Sir_Tim_Berners-Lee.jpg/330px-Sir_Tim_Berners-Lee.jpg)

> In 1990, he published the [worlds first website](http://info.cern.ch/hypertext/WWW/TheProject.html).

1. [x] Tim Berners-Lee
1. [ ] Alan Turing
1. [ ] Barbara Liskov
1. [ ] Larry Page


#### Which console appeared first, witch last?

1. Atari 2600
2. NES
3. Sega Genesis
4. Play Station
5. Nintendo 64
6. Xbox
7. Wii
```
