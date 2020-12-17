# quizdown

![Build and deploy](https://github.com/bonartm/quizdown-js/workflows/Build%20and%20deploy/badge.svg)

Markdownish syntax for generating interactive quizzes. Inspired by the [mermaid library](https://mermaid-js.github.io/mermaid/#/) and the python package [quizdown](https://github.com/jjfiv/quizdown).

## Usage

1. Include the `quizdown.js` library and the corresponding `quizdown.css` in your page:

```html
<head>
    <link rel="stylesheet" href="quizdown.css" />
    <script defer src="quizdown.js"></script>
</head>
```

You can also use `jsdelivr`:

```html
<head>
    <link 
        rel="stylesheet" 
        href="https://cdn.jsdelivr.net/gh/bonartm/quizdown-js@v0.0.1-alpha.1/dist/quizdown.css"
    />
    <script 
        defer 
        src="https://cdn.jsdelivr.net/gh/bonartm/quizdown-js@v0.0.1-alpha.1/dist/quizdown.js">
    </script>
</head>
```

2. Each quiz has to be embedded in a `<div class="quizdown">` tag:

```html
<body>
    <h2>Here comes a quizdown quiz:</h2>

    <div class="quizdown">
        ### What's the capital of Germany? 
        
        - [x] Berlin
        - [ ] Frankfurt 
        - [ ] Paris 
        - [ ] Cologne
    </div>
</body>
```

Combining all steps should lead to something like this:

```html
<html>
    <head>
        <link rel="stylesheet" href="quizdown.css" />
        <script defer src="quizdown.js"></script>
    </head>
    <body>
        <div class="quizdown">
            ### What's the capital of Germany? 
            
            - [x] Berlin 
            - [ ] Frankfurt 
            - [] Paris 
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

-   A quiz is initialized with a `<div class="quizdown"><div>` tag.
-   Inside the `div` you can write quizzes in a markdown-like syntax.
-   Each quiz task begins with a description/ question: `### How are you?`

### Multiple choice

```markdown
### What's the capital of Germany?

-   [x] Berlin
-   [ ] Frankfurt
-   [ ] Paris
-   [ ] Cologne
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

Compile the grammar and build the library with

```bash
npm run build
```

You can also preview a live version with

```bash
npm run dev
```
