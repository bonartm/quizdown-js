<script lang="ts">
    import type { Quiz } from '../quiz';
    export let quiz: Quiz;
    let emojis = ['❌', '✅'];
    import { _ } from 'svelte-i18n';
    import Buttons from './Buttons.svelte';
    import Button from './Button.svelte';

    let points = quiz.evaluate();
</script>

<h3>{$_('resultsTitle')}</h3>

<p>
    {@html $_('resultsText', {
        values: {
            points: `<i>${points}</i>`,
            total: `<i>${quiz.questions.length}</i>`,
        },
    })}
</p>

<ol>
    {#each quiz.questions as question, i}
        <li class="top-list-item" on:click="{() => quiz.jump(i)}">
            <span class="list-question">
                {emojis[+question.solved]}
                Q{i + 1}:{@html question.text}
            </span>
            <ol>
                <!-- answer comments when selected and available -->
                {#each question.selected as selected}
                    {#if question.answers[selected].comment !== ''}
                        <li class="list-comment">
                            <i>{@html question.answers[selected].html}</i>:
                            {@html question.answers[selected].comment}
                        </li>
                    {/if}
                {/each}
            </ol>
        </li>
    {/each}
</ol>

<!-- start quiz again on result page -->
<Buttons>
    <Button buttonAction="{quiz.reset}">{$_('reset')}</Button>
</Buttons>

<style>
    .top-list-item {
        margin-bottom: 0.2rem;
        list-style-type: none;
    }

    .top-list-item:hover {
        cursor: pointer;
        background-color: var(--quizdown-color-secondary);
    }

    .top-list-item:hover .list-question {
        text-decoration: underline;
    }

    .list-comment {
        margin-left: 2em;
        list-style-type: initial;
    }
</style>
