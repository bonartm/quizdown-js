# Use quizdown as a ES6 Module

Quizdown can be imported into other projects. First install with:

```
npm install quizdown
```

And use it in your code to create a quiz app:


```typescript
import { createApp } from 'quizdown'


let node = document.querySelector('.quizdown');
                   
let config = {
    'locale': 'de',
    'shuffleAnswers': false
}

let rawQuizdown = `

# This is awesome!

- [x] True
- [ ] False
`

createApp(rawQuizdown, node, config)
```
