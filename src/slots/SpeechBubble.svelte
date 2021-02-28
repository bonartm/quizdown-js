<div class="quizdown-bubble">
    <slot></slot>
</div>

<style>
    .quizdown-bubble {
        position: absolute;
        max-width: 100%;        
        background-color: orange;
        padding: 0.5em;
        font-size: 0.9em;
        box-shadow:	0 0.125rem 0.5rem rgba(0, 0, 0, .3), 0 0.0625rem 0.125rem rgba(0, 0, 0, .2);
    }

    .quizdown-bubble::before {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        bottom: 100%;
        left: 1em;
        border: .75rem solid transparent;
        border-top: none;
        border-bottom-color: orange;
        filter: drop-shadow(0 -0.0625rem 0.0625rem orange);
    }
</style>