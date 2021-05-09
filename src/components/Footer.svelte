<script lang="ts">
    import type { Quiz } from '../quiz';
    import Button from './Button.svelte';
    import { _ } from 'svelte-i18n';

    export let quiz: Quiz;

    $: counter = quiz.counter;
    $: finished = quiz.finished;
    $: current = quiz.questions[$counter];

    let show_hint = false;
    // disable hint on new question
    $: {
        $counter;
        show_hint = false;
    }
</script>

<div class="button-row">
    {#if $counter === counter.max}
        <!-- start quiz again on result page -->
        <Button buttonAction="{quiz.reset}">{$_('reset')}</Button>
    {:else}
        <!-- show hint on every question page -->
        <Button
            disabled="{current.hint === null || current.hint === ''}"
            buttonAction="{() => (show_hint = !show_hint)}">{$_('hint')}</Button
        >
        {#if $finished}
            <!-- jump back to result page when finished -->
            <Button buttonAction="{quiz.evaluate}">{$_('evaluate')}</Button>
        {:else if $counter === counter.max - 1}
            <!-- evaluation on last question -->
            <Button buttonAction="{quiz.evaluate}">{$_('evaluate')}</Button>
        {:else}
            <Button buttonAction="{quiz.next}">{$_('next')}</Button>
        {/if}
    {/if}
</div>

{#if show_hint}
    <p class="quizdown-hint">{@html current.hint}</p>
{/if}

<div class="quizdown-credits">
    <!-- inject the version number using rollup-plugin-version-injector -->
    <a href="https://github.com/bonartm/quizdown-js"
        >quizdown-js {'[VI]v{version}[/VI]'}</a
    >
</div>

<style>
    .button-row {
        margin-top: 1em;
        display: flex;
        justify-content: left;
    }
    .quizdown-credits a {
        color: gray;
        text-decoration: none;
    }

    .quizdown-credits a:hover {
        text-decoration: underline;
    }

    .quizdown-credits {
        margin-top: 1rem;

        font-size: small;
        text-align: end;
        color: lightgray;
    }

    .quizdown-hint {
        font-size: smaller;
    }
</style>
