# quizdown [![npm version](https://badge.fury.io/js/quizdown.svg)](https://badge.fury.io/js/quizdown) [![Build](https://github.com/bonartm/quizdown-js/actions/workflows/build.yml/badge.svg)](https://github.com/bonartm/quizdown-js/actions/workflows/build.yml)

> Markdownish syntax to instantly create simple interactive quiz apps for your static website.

I'm working on this project in my free time to learn more about modern web development and languages. This is a toy project and should not be used in serious projects for now. 

### 🚀 Try the [quizdown live editor](https://bonartm.github.io/quizdown-live-editor/)

- supports markdown text formatting, images, syntax highlighting and math rendering.
- different [quiz-types](./docs/syntax.md): single-choice, multiple-choice, sequence.
- support for [hints and explanations](./docs/syntax.md#hints-and-comments).
- [options](./docs/options.md) for color theme, question shuffling, localization.
- can be easily included in any website, static site generator or [other web projects](./docs/module_import.md).
- mobile friendly with touch support for all question types.

## Usage

quizdown is easy to setup and best used in combination with existing static site generators like *Jekyll*, *Hugo* or *Sphinx*. Check out the extensions
[hugo-quiz](https://github.com/bonartm/hugo-quiz) and [sphinxcontrib-quizdown](https://github.com/bonartm/sphinxcontrib-quizdown).

### 📚 [Documentation](./docs/)

## Stand-alone Example

Add the library to your website and initialize with default options:

```html
<head>
	...
    <script 
	src="https://cdn.jsdelivr.net/npm/quizdown@latest/public/build/quizdown.js">
	</script>
	<script>quizdown.init();</script>
	...
</head>
```

To keep the bundle size low, syntax highlighting and math rendering are implemented in separate extensions that can be loaded and registered manually if needed: 

```html
<head>
	...
    <script src="./build/quizdown.js"></script>
	<script src="./build/extensions/quizdownKatex.js"></script>
	<script src="./build/extensions/quizdownHighlight.js"></script>
	<script>
		quizdown.register(quizdownKatex).register(quizdownHighlight).init();
	</script>
	...
</head>
```

Write questions within a `quizdown` class (edit in the [🚀quizdown editor](https://bonartm.github.io/quizdown-live-editor/?code=---%0AprimaryColor%3A%20steelblue%0AshuffleQuestions%3A%20false%0AshuffleAnswers%3A%20true%0A---%0A%0A%23%23%23%20Select%20your%20superpowers!%0A%0A-%20%5B%20%5D%20Enhanced%20Strength%0A-%20%5B%20%5D%20Levitation%0A-%20%5Bx%5D%20Shapeshifting%0A%0A%23%23%23%20What%27s%20the%20capital%20of%20Germany%3F%0A%0A%3E%20Hint%3A%20The%20_largest_%20city%20in%20Germany...%0A%0A1.%20%5Bx%5D%20Berlin%0A1.%20%5B%20%5D%20Frankfurt%0A1.%20%5B%20%5D%20Paris%0A1.%20%5B%20%5D%20Cologne)):

```html
...
<div class="quizdown">
	---
	primaryColor: steelblue
	shuffleQuestions: false
	shuffleAnswers: true
	---

	### Select your superpowers!

	- [ ] Enhanced Strength
	- [ ] Levitation
	- [x] Shapeshifting

	### What's the capital of Germany?

	> Hint: The _largest_ city in Germany...

	1. [x] Berlin
	1. [ ] Frankfurt
	1. [ ] Paris
	1. [ ] Cologne
</div>
...
```

## Additional Options

| Option | Type | Description | Default Value |
| ------ | ---- | ----------- | --- |
| startOnLoad | boolean | Parse the Quiz at loading | `True` | 
| shuffleAnswers | boolean | Shuffle the answers | `True` |
| shuffleQuestions | boolean | Shuffle the questions | `False` |
| nQuestions | number | Number of questions | undefined |
| primaryColor | string | Color of the progress bar | 'steelblue' |
| secondaryColor | string | Background color of the selections  | '#f2f2f2' |
| textColor | string | Color of the text | 'black' |
| passingGrade | number | Number of points to success. | undefined |
| customPassMsg | string | Success message. Only displayed if passingGrade is set and reached | 'You have passed' |
| customFailMsg | string | Failure message. Only displayed if passingGrade is set and not passed | 'You have not passed' |
| locale | string | Used language. Possible are 'de', 'en', 'es', 'fr' | null |
| enableRetry | boolean | Enable Retry button | `True` | 
| customStyleSheet | string | Add an own css file for style updating | 'customQuizdown.css' |

## Contributing

Pull requests and feature requests are welcome. For major changes, please open an issue first to discuss what you would like to change. I'm happy for any feedback on how to improve the code base. 

### Wish List

- support for videos via youtube api (https://github.com/bonartm/quizdown-js/issues/10)
- customizable reward page at the end of the quiz (https://github.com/bonartm/quizdown-js/issues/14)
- fill in the blanks quiz (https://github.com/bonartm/quizdown-js/issues/17)
- link quizzes on different pages together via a results summary page (https://github.com/bonartm/quizdown-js/issues/18)

### How To

After cloning, install the packages with 

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


## Credits

Inspired by the [mermaid library](https://mermaid-js.github.io/mermaid/#/) and the python package [quizdown](https://github.com/jjfiv/quizdown).
