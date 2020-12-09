# quizdown

Markdownish syntax for generating interactive quizzes. Inspired by the [mermaid library](https://mermaid-js.github.io/mermaid/#/) and the python package [quizdown](https://github.com/jjfiv/quizdown). 

## Usage

1. Include the `quizdown.js` library in your page:
```html
<body>
  <script src="quizdown.js"></script>
</body>
```

2. Each quiz has to by embedded in a `<div class="quizdown">` tag:

```html
<body>
  <h2> Here comes a quizdown quiz: </h2>

  <div class="quizdown">
    ### What's the capital of Germany?

    - [x] Berlin
    - [ ] Frankfurt
    - [ ] Paris
    - [ ] Cologne
  </div>
</body>
```

<!-- 3. Initialize the library by calling `quizdown.initialize()`

```html
<body>
  <script>quizdown.initialize();</script>
</body> -->
```

Combining all steps should lead to something like this:

```html
<html>
  <body>
    <script src="quizdown.js"></script>
    <!-- <script>quizdown.initialize();</script> -->

    <div class="quizdown">
        ### What's the capital of Germany?
        - [x] Berlin
        - [ ] Frankfurt
        - [ ] Paris
        - [ ] Cologne

        ### Please bring the following into order!

        1. 1
        2. 2
        3. 3
        4. 4
        5. 5

        ### Please assign a word to each concept!


        banana -> fruit
        apple -> fruit
        tomato -> vegetable
        kiwi -> fruit

  </div>    
  </body>
</html>
```

## Quiz types and syntax

- A quiz is initialized with a `<div class="quizdown"><div>` tag. 
- Inside the `div` you can write quizzes in a markdown-like syntax. 
- Each quiz task begins with a description/ question: `### How are you?`

### Multiple choice

```markdown
### What's the capital of Germany?
- [x] Berlin
- [ ] Frankfurt
- [ ] Paris
- [ ] Cologne
```

### Sequence

```markdown
### Please bring the following into sequence!

1. One
2. Two
3. Three
4. Four
5. Five
```

### Pairs

```markdown
### Please assign a word to each concept!
banana -> fruit
apple -> fruit
tomato -> vegetable
kiwi -> fruit
```

## Development

compile the grammar and build the library with 

```bash
npm run build
```
