<script lang="ts">
    import type { Quiz } from '../quiz';
    import { onMount, beforeUpdate, afterUpdate } from 'svelte';

    export let quiz: Quiz;
    let emojis = ['❌', '✅'];
    import { _ } from 'svelte-i18n';
    import Buttons from './Buttons.svelte';
    import Button from './Button.svelte';
    import { fade, fly } from 'svelte/transition';
    import Icon from './Icon.svelte';
    import Loading from './Loading.svelte';
    import { get } from 'svelte/store';

    let waitTime = 1500;
    if (get(quiz.isEvaluated)) {
        // only wait longer for the first time
        waitTime = 400;
    }
    let points = 0;
    beforeUpdate(() => (points = quiz.evaluate()));
</script>

<h3>{$_('resultsTitle')}</h3>
<Loading ms="{waitTime}">
    <div in:fade="{{ duration: 1000 }}">
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
                                    <i
                                        >{@html question.answers[selected]
                                            .html}</i
                                    >:
                                    {@html question.answers[selected].comment}
                                </li>
                            {/if}
                        {/each}
                    </ol>
                </li>
            {/each}
        </ol>
    </div>
</Loading>

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
