# Getting Started

1. Include the `quizdown.js` library in your page:

```html
<head>
    <script src="quizdown.js"></script>
</head>
```

Or using a CDN:

```html
<head>
    <script src="https://cdn.jsdelivr.net/gh/bonartm/quizdown-js@latest/public/build/quizdown.js"></script>
</head>
```

2. Initialize the quizdown library:

```html
<script>
    quizdown.init();
</script>
```

This will look for all `div`s with `class="quizdown"` and convert the quizdown into an interactive quiz app.
You can also pass [global options](./options.md) to the `init` call.


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

````html
<html>
    <head>
        <link rel="stylesheet" href="quizdown.css" />
        <script src="quizdown.js"></script>
        <script>
            quizdown.init();
        </script>
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
            
            Below you find the steps of the machine learning workflow. 
            Do you find the **correct order**? 
            
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
            x = 2+2 y = x+2 print(y) 
            ``` 
            
            - [ ] `2` 
            - [x] `6` 
            - [ ] `None` 
            - [ ] `9`
        </div>
    </body>
</html>
````

## How to continue

- checkout and read about the [quizdown syntax](./syntax.md).
- tryout the [quizdown live editor](https://bonartm.github.io/quizdown-live-editor/).
- read about the supported [configuration and options](options.md).
- learn about how to [`import` quizdown](./module_import.md) and use it programmatically to have full control on how and when to create quizdown app in your project. 

