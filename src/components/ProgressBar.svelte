<script lang='ts'>
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';
    import type { Quiz } from '../quiz';

    export let quiz: Quiz;
    $: counter = quiz.counter
    $: finished = quiz.finished

    const animated_current_block = tweened(0, {
        duration: 400,
        easing: cubicOut,
    });

    $: {
        if ($finished) {
            animated_current_block.set(quiz.counter.max - 0.5)
        } else {
            animated_current_block.set($counter + 0.1)
        }
    }

    $: progress_percent = String(($animated_current_block / (quiz.counter.max-0.5)) * 100) + '%';
</script>

<div class="quizdown-progress" data-label="">
    <span class="value" style="width: {progress_percent}">
        {#if !$finished}
            {$counter+1}/{counter.max} 
        {/if}
</div>

<style>
    .quizdown-progress {
        height: 1.5em;
        width: 100%;
        background-color: lightgray;
        position: relative;
    }

    .quizdown-progress:before {
        content: attr(data-label);
        font-size: 0.8em;
        position: absolute;
        text-align: center;
        top: 5px;
        left: 0;
        right: 0;
    }

    .quizdown-progress .value {
        background-color: #db9717;
        display: block;
        text-align: left;
        font-size: smaller;
        font-weight: bolder;
        height: 100%;
        box-shadow: 3px 3px orange, 2px 2px orange, 1px 1px orange;
        text-align:end;
        white-space: nowrap;
    }
</style>
