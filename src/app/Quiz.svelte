<script>
    import MultipleChoice from './MultipleChoice.svelte';
    import Sequence from './Sequence.svelte';
    import Pairs from './Pairs.svelte';
    import Buttons from './Buttons.svelte';
    import ProgressBar from './ProgressBar.svelte';
    import QuizResult from './QuizResult.svelte';
    import { writable } from 'svelte/store';
    import { fly } from 'svelte/transition';

    export let quiz_data;
    // export const quiz_results = writable([]);

    const components = {
        'multiple-choice': MultipleChoice,
        sequence: Sequence,
        pairs: Pairs,
    };

    const hide = (node, { duration, delay }) => {
        return {
            duration: duration + delay,
            css: (t) => `opacity: 0; position:absolute;`,
        };
    };

    const max_idx = quiz_data.length;

    $: current_idx = 0;
</script>

<div class="container">
    <ProgressBar current="{current_idx}" max="{max_idx}" />

    {#key current_idx}
        <div in:hide="{{ duration: 600, delay: 200 }}">
            <h2
                in:fly="{{ x: 400, duration: 600, delay: 600 }}"
                out:fly="{{ x: -400, duration: 600, delay: 200 }}">
                {#if current_idx == max_idx}
                    Your quiz results!
                {:else}
                    {current_idx + 1}/{max_idx}:
                    {quiz_data[current_idx]['data']['question']}
                {/if}
            </h2>
        </div>
        <div in:hide="{{ duration: 800, delay: 0 }}">
            <div
                in:fly="{{ x: 400, duration: 800, delay: 800 }}"
                out:fly="{{ x: -400, duration: 800 }}">
                {#if current_idx == max_idx}
                    <QuizResult data="{quiz_data}" />
                {:else}
                    <svelte:component
                        this="{components[quiz_data[current_idx]['type']]}"
                        data="{quiz_data[current_idx]['data']}" />
                {/if}
            </div>
        </div>
    {/key}

    <Buttons bind:current="{current_idx}" max="{max_idx}" />
</div>

<style>
    @font-face {
        font-family: 'Gelasio';
        font-style: normal;
        font-weight: 400;
        src: url(https://fonts.gstatic.com/s/gelasio/v1/cIf9MaFfvUQxTTqS9C6hYQ.woff2)
            format('woff2');
    }

    .container {
        font-family: 'Lucida Console', 'Courier New', monospace;
        text-align: center;
        max-width: 600px;
        min-height: 400px;
        overflow: hidden;
    }

    h2 {
        padding: 0.3em;
        background-color: orange;
        border: 2px solid orange;
        transform: skew(5deg, 0deg);
        width: 80%;
        text-align: center;
        margin: auto;
        margin-top: 1em;
        margin-bottom: 1em;
    }
</style>
