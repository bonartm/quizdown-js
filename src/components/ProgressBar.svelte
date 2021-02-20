<script>
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';

    export let current;
    export let max;

    const animated_current_block = tweened(0, {
        duration: 400,
        easing: cubicOut,
    });

    $: animated_current_block.set(current + 0.1);
    $: progress_percent = String(($animated_current_block / max) * 100) + '%';
</script>

<div class="progress" data-label="">
    <span class="value" style="width: {progress_percent}"></span>
</div>

<style>
    .progress {
        height: 1.5em;
        width: 100%;
        background-color: lightgray;
        position: relative;
    }

    .progress:before {
        content: attr(data-label);
        font-size: 0.8em;
        position: absolute;
        text-align: center;
        top: 5px;
        left: 0;
        right: 0;
    }

    .progress .value {
        background-color: #db9717;
        display: block;
        text-align: left;
        height: 100%;
        box-shadow: 3px 3px orange, 2px 2px orange, 1px 1px orange;
    }
</style>
