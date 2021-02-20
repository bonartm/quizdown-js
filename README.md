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
        href="https://cdn.jsdelivr.net/gh/bonartm/quizdown-js@v0.0.1/public/build/quizdown.css"
    />
    <script 
        defer 
        src="https://cdn.jsdelivr.net/gh/bonartm/quizdown-js@v0.0.1/public/build/quizdown.js">
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
            	# What is the capital of Berlin?

				In this question you are asked a **very** difficult question.

				> Do some research!

				- [x] Berlin
				- [ ] Stuttgart
				- [ ] Cologne
				- [ ] Düsseldorf

				# Please bring the following into order!

				Below you find the steps of the machine learning workflow. Do you find the **correct order**?

				> The model selection happens before the `final model evaluaton`!

				1. Get the data
				2. Explore the data
				3. Train test split with `train_test_split()`
				4. Feature engineering
				5. Model selection
				6. Model evaluation
				7. Deployment

				# What is the value of `y`?

				```python
				x = 2+2
				y = x+2
				print(y)
				```

				- [ ] `2`
				- [x] `6`
				- [ ] `None`
				- [ ] `9`
        </div>
    </body>
</html>
```

## Quiz types and syntax

- A quiz is initialized with a `<div class="quizdown"><div>` tag.
- Inside the `div` you can write quizzes in a markdown-like syntax.
- Each quiz task begins with a question: `### How are you?`
- You can add hints as in a *blockquote* `>`

### Multiple choice

```markdown
### What's the capital of Germany?

> Hint: The *largest* city in Germany...

-   [x] Berlin
-   [ ] Frankfurt
-   [ ] Paris
-   [ ] Cologne
```

### Sequence

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

banana -> fruit
apple -> fruit
tomato -> vegetable
kiwi -> fruit
```

### Fill in the Blanks (WIP)



## Development

Install the packages with 

```bash
npm install
```

Build the library with

```bash
npm run build
```

You can also preview a live version with

```bash
npm run dev
```
