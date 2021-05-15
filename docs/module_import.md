# Use quizdown as a ES6 Module

Quizdown can be imported into other projects. First install with:

```
npm install quizdown
```

And use it in your code to create a quiz app:


```typescript
import { create_app } from 'quizdown'


let node = document.querySelector('.quizdown');
                   
let config = {
    'locale': 'de',
    'shuffle_answers': false
}

let raw_quizdown = `

# This is awesome!

- [x] True
- [ ] False
`

create_app(raw_quizdown, node, config)
```

