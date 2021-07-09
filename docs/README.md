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
    <script src="https://cdn.jsdelivr.net/npm/quizdown@latest/public/build/quizdown.js"></script>
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

Combining all steps leads to something like this (edit in the [🚀quizdown editor](https://bonartm.github.io/quizdown-live-editor/?code=%23%20What%20is%20the%20capital%20of%20Berlin%3F%20%0A%0AIn%20this%20question%20you%20are%20asked%20a%20**very**%20difficult%20question.%20%0A%0A%3E%20Do%20some%20research!%20%0A%0A-%20%5Bx%5D%20Berlin%0A%20%20%20%20%3E%20This%20is%20the%20correct%20answer.%20%0A-%20%5B%20%5D%20Stuttgart%20%0A-%20%5B%20%5D%20Cologne%20%0A%20%20%20%20%3E%20Cologne%20is%20the%20fourth%20largest%20city.%20%0A-%20%5B%20%5D%20D%C3%BCsseldorf%20%0A%0A%23%20Please%20bring%20the%20following%20into%20order!%20%0A%0ABelow%20you%20find%20the%20steps%20of%20the%20machine%20learning%20workflow.%20%0ADo%20you%20find%20the%20**correct%20order**%3F%20%0A%0A%3E%20The%20model%20selection%20happens%20before%20the%20%60final%20model%20evaluaton%60!%20%0A%0A1.%20Get%20the%20data%20%0A2.%20Explore%20the%20data%20%0A3.%20Train%20test%20split%20with%20%60train_test_split()%60%20%0A4.%20Feature%20engineering%20%0A5.%20Model%20selection%20%0A6.%20Model%20evaluation%20%0A7.%20Deployment%20%0A%0A%23%20What%20is%20the%20value%20of%20%60y%60%3F%20%0A%0A%60%60%60python%0Ax%20%3D%202%2B2%20y%20%3D%20x%2B2%20print(y)%20%0A%60%60%60%20%0A%0A-%20%5B%20%5D%20%602%60%20%0A-%20%5Bx%5D%20%606%60%20%0A-%20%5B%20%5D%20%60None%60%20%0A-%20%5B%20%5D%20%609%60)):

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

