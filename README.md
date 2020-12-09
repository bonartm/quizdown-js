# quizzy

Markdownish syntax for generating interactive quizzes. Inspired by the [mermaid library](https://mermaid-js.github.io/mermaid/#/).

## Usage

1. Include the `quizzy.js` library in your page:
```html
<body>
  <script src="quizzy.js"></script>
</body>
```

2. Each quiz has to by embedded in a `<div class="quizzy">` tag:

```html
<body>
  <h2> Here comes a quizzy quiz: </h2>

  <div class="quizzy">
    ### What's the capital of Germany?

    - [x] Berlin
    - [ ] Frankfurt
    - [ ] Paris
    - [ ] Cologne
  </div>
</body>
```

<!-- 3. Initialize the library by calling `quizzy.initialize()`

```html
<body>
  <script>quizzy.initialize();</script>
</body> -->
```

Combining all steps should lead to something like this:

```html
<html>
  <body>
    <script src="quizzy.js"></script>
    <!-- <script>quizzy.initialize();</script> -->

    <div class="quizzy">
        ### What's the capital of Germany?
        - [x] Berlin
        - [ ] Frankfurt
        - [ ] Paris
        - [ ] Cologne

        ---

        ### Please bring the following into order!

        1. 1
        2. 2
        3. 3
        4. 4
        5. 5

        --- 

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

A quiz is initialized with a `<div class="quizzy"><div>` tag. Inside the `div` 
you can write quizzes in a markdown-like syntax. 

- Each quiz task is separated by `---`
- Each quiz task begins with a description/ question: `### How are you?`
- After the description one can choose one of the following quit types:


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

1. 1
2. 2
3. 3
4. 4
5. 5
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

compile the grammar files in the `src/garammers/` directory by running

```bash
npm run compile
```

build the library with 

```bash
npm run build
```


