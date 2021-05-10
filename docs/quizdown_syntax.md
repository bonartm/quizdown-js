## Quiz types and syntax

-   Inside the `div` you can write quizzes in a markdown-like syntax.
-   Each quiz task begins with a question: `### How are you?`.
-   You can add hints in a _blockquote_ `>`.
-   You can format your text using markdown.
-   Quizdown uses `highlight.js` for syntax highlighting. Currently, only python code is highlighted.

### Multiple choice question

You can add a _blockquote_ to the answer to make comments that will be shown in the end. The comment is shown if the answer was selected.

```markdown
### What's the capital of Germany?

> Hint: The _largest_ city in Germany...

-   [x] Berlin
    > this is the correct answer.
-   [ ] Frankfurt
-   [ ] Paris
    > Paris is the capital of France.
-   [ ] Cologne
```

### Single choice question

```markdown
### Select your superpower!

1. [ ] Enhanced Strength
1. [ ] Levitation
1. [x] Shapeshifting
    > the best superpower!
```

### Sequence

Note that the answers for sequence questions are always shuffled.

```markdown
### Please bring the following into sequence!

That's **super easy**!

1. One
2. Two
3. Three
4. Four
5. Five
```

### Pairs (WIP)

```markdown
### Please assign a word to each concept!

Fruits and vegetables ...

> kiwi is a fruit...

-   [banana](fruit)
-   [apple](fruit)
-   [tomato](vegetable)
-   [kiwi](fruit)
```

### Fill in the Blanks (WIP)

...

## Quiz options and color theme

You can set global options via the `init` call but also quiz and question specific options
inside the quizdown using YAML headers. Here is an example:

```markdown
---
primary_color: '#FF851B'
secondary_color: '#DDDDDD'
text_color: black
locale: de
---

# What is the capital of Berlin?

---

shuffle_answers: false

---

In this question you are asked a **very** difficult question.

> Do some research!

-   [x] Berlin
-   [ ] Stuttgart
-   [ ] Cologne
-   [ ] Düsseldorf
```

Note that the color options only have an effect when set via the `init` call or via
a quiz wide YAML header.
