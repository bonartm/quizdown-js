# Quiz types and syntax


Quizzes are written in a markdown-like syntax. Quizdown is valid markdown and the raw quizdown code 
can therefore be easily inspected in common markdown editors like GitHub, Typora, ...

- Each quiz question begins with a header: `### How are you?`. The level of the headline has no influence on the appearance. 
- You can add images, code, bold text, links using markdown formatting. 
- Quizdown uses `highlight.js` for syntax highlighting. Currently, only python and html code is highlighted.
- *Blockquotes* are used for rendering (hidden) hints and comments. 

Here is an example that shows many features:

```markdown
#### Who is the person in the picture?

![](https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Sir_Tim_Berners-Lee.jpg/330px-Sir_Tim_Berners-Lee.jpg)

> In 1990, he published the [worlds first website](http://info.cern.ch/hypertext/WWW/TheProject.html).

1. [x] Tim Berners-Lee
    > This is the correct answer!
1. [ ] Alan Turing
1. [ ] Barbara Liskov
1. [ ] Larry Page
    > This is not Larry Page ;)
```

## Hints and comments

The user can activate hints by pressing a button. If no hint is provided the button is grayed out. 
Comments to answers are shown at the result page (only if the user selected an answer that contained a comment).

## Multiple choice question

Multiple choice questions use unordered task lists for marking the right answer(s):

```markdown
### What's the capital of Germany?

> It's the _largest_ city in Germany...

-   [x] Berlin
    > this is the correct answer.
-   [ ] Frankfurt
-   [ ] Paris
    > Paris is the capital of France.
-   [ ] Cologne
```

## Single choice question

Single choice questions use ordered task lists. Only one answer can be marked as correct:

```markdown
### Select your superpower!

There exist many superpowers in the world but one of them is better than everything else. Do you find it?

1. [ ] Enhanced Strength
1. [ ] Levitation
1. [x] Shapeshifting
    > Correct. This the best superpower!
```

## Sequence

Users can drag and drop the answers into the correct order. The answers are always shuffled when 
presented to the user. 

```markdown

## Please bring the following into sequence!

That's **super easy**!

> Three is larger than one...

1. One
2. Two
3. Three
4. Four
5. Five
```

---

## Pairs (WIP)

...

## Fill in the Blanks (WIP)

...

