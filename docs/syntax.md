# Quiz types and syntax


Quizzes are written in a markdown-like syntax. Quizdown is valid markdown and the raw quizdown code 
can therefore be easily inspected in common markdown editors like GitHub, Typora, ...

- Each quiz question begins with a header: `### How are you?`. The level of the headline has no influence on the appearance. 
- You can add images, code, bold text, links using markdown formatting. 
- Quizdown uses `highlight.js` for syntax highlighting.
- *Blockquotes* are used for rendering (hidden) hints and comments. 

Here is an example that shows many features (edit in the [🚀quizdown editor](https://bonartm.github.io/quizdown-live-editor/?code=%23%23%23%23%20Who%20is%20the%20person%20in%20the%20picture%3F%0A%0A!%5B%5D(https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F9%2F9d%2FSir_Tim_Berners-Lee.jpg%2F330px-Sir_Tim_Berners-Lee.jpg)%0A%0A%3E%20In%201990%2C%20he%20published%20the%20%5Bworlds%20first%20website%5D(http%3A%2F%2Finfo.cern.ch%2Fhypertext%2FWWW%2FTheProject.html).%0A%0A1.%20%5Bx%5D%20Tim%20Berners-Lee%0A%20%20%20%20%3E%20This%20is%20the%20correct%20answer!%0A1.%20%5B%20%5D%20Alan%20Turing%0A1.%20%5B%20%5D%20Barbara%20Liskov%0A1.%20%5B%20%5D%20Larry%20Page%0A%20%20%20%20%3E%20This%20is%20not%20Larry%20Page%20%3B)):

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

## Multiple choice question ([🚀 editor](https://bonartm.github.io/quizdown-live-editor/?code=%23%23%23%20What%27s%20the%20capital%20of%20Germany%3F%0A%0A%3E%20It%27s%20the%20_largest_%20city%20in%20Germany...%0A%0A-%20%5Bx%5D%20Berlin%0A%20%20%20%20%3E%20this%20is%20the%20correct%20answer.%0A-%20%5B%20%5D%20Frankfurt%0A-%20%5B%20%5D%20Paris%0A%20%20%20%20%3E%20Paris%20is%20the%20capital%20of%20France.%0A-%20%5B%20%5D%20Cologne))

Multiple choice questions use unordered task lists for marking the right answer(s):

```markdown
### What's the capital of Germany?

> It's the _largest_ city in Germany...

- [x] Berlin
    > this is the correct answer.
- [ ] Frankfurt
- [ ] Paris
    > Paris is the capital of France.
- [ ] Cologne
```

## Single choice question  ([🚀 editor](https://bonartm.github.io/quizdown-live-editor/?code=%23%23%23%20Select%20your%20superpower!%0A%0AThere%20exist%20many%20superpowers%20in%20the%20world%20but%20one%20of%20them%20is%20better%20than%20everything%20else.%20Do%20you%20find%20it%3F%0A%0A1.%20%5B%20%5D%20Enhanced%20Strength%0A1.%20%5B%20%5D%20Levitation%0A1.%20%5Bx%5D%20Shapeshifting%0A%20%20%20%20%3E%20Correct.%20This%20the%20best%20superpower!))

Single choice questions use ordered task lists. Only one answer can be marked as correct:

```markdown
### Select your superpower!

There exist many superpowers in the world but one of them is better than everything else. Do you find it?

1. [ ] Enhanced Strength
1. [ ] Levitation
1. [x] Shapeshifting
    > Correct. This the best superpower!
```

## Sequence ([🚀 editor](https://bonartm.github.io/quizdown-live-editor/?code=%23%23%20Please%20bring%20the%20following%20into%20sequence!%0A%0AThat%27s%20**super%20easy**!%0A%0A%3E%20Three%20is%20larger%20than%20one...%0A%0A1.%20One%0A2.%20Two%0A3.%20Three%0A4.%20Four%0A5.%20Five))

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

