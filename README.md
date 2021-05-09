# quizdown

![Build and deploy](https://github.com/bonartm/quizdown-js/workflows/Build%20and%20deploy/badge.svg)

Markdownish syntax for generating interactive quizzes. Inspired by the [mermaid library](https://mermaid-js.github.io/mermaid/#/) and the python package [quizdown](https://github.com/jjfiv/quizdown).


### Try quizdown in the [**live editor**](https://bonartm.github.io/quizdown-live-editor/).


## Usage

quizdown is best used in combination with existing static site generators like hugo or sphinx. Check out
[hugo-quiz](https://github.com/bonartm/hugo-quiz) and [sphinxcontrib-quizdown](https://github.com/bonartm/sphinxcontrib-quizdown).


## Getting Started

1. Include the `quizdown.js` library in your page:

```html
<head>
    <script src="quizdown.js"></script>
</head>
```

Or using a CDN: 

```html
<head>
    <script 
        src="https://cdn.jsdelivr.net/gh/bonartm/quizdown-js@latest/public/build/quizdown.js">
    </script>
</head>
```


2. Initialize the quizdown library:

```html
<script>quizdown.init();</script>
```

This will look for all `div`s with `class="quizdown"` and convert the quizdown into an interactive quiz app.
You can pass some global options to the `init` call. Currently supported:

```javascript
quizdown.init({
	start_on_load: true;			// detect and convert all divs with class quizdown
    shuffle_answers: true;			// shuffle answers for each question
    shuffle_questions: false;       // shuffle questsions for each quiz
    primary_color: '#FF851B';       // primary CSS color
    secondary_color: '#DDDDDD';     // secondary CSS color
    text_color: 'black';            // text color of some elements
})
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

Combining all steps leads to something like this:

```html
<html>
    <head>
        <link rel="stylesheet" href="quizdown.css" />
        <script src="quizdown.js"></script>
		<script>quizdown.init();</script>
    </head>
    <body>
        <div class="quizdown">
			# What is the capital of Berlin?

			In this question you are asked a **very** difficult question.

			> Do some research!

			- [x] Berlin
				> This is the correct answer.
			- [ ] Stuttgart
			- [ ] Cologne
				> Cologne is the fourth largest city.
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

- Inside the `div` you can write quizzes in a markdown-like syntax.
- Each quiz task begins with a question: `### How are you?`.
- You can add hints in a *blockquote* `>`.
- You can format your text using markdown.
- Quizdown uses `highlight.js` for syntax highlighting. Currently, only python code is highlighted.


### Multiple choice question

You can add a *blockquote* to the answer to make comments that will be shown in the end. The comment is shown if the answer was selected. 

```markdown
### What's the capital of Germany?

> Hint: The *largest* city in Germany...

- [x] Berlin
	> this is the correct answer.
- [ ] Frankfurt
- [ ] Paris
	> Paris is the capital of France.
- [ ] Cologne
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

- [banana](fruit)
- [apple](fruit)
- [tomato](vegetable)
- [kiwi](fruit)
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

- [x] Berlin
- [ ] Stuttgart
- [ ] Cologne
- [ ] Düsseldorf

```

Note that the color options only have an effect when set via the `init` call or via 
a quiz wide YAML header. 



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
