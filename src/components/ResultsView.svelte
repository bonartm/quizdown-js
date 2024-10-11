<script lang="ts">
    import type { Quiz } from '../quiz';
    import { beforeUpdate } from 'svelte';

    export let quiz: Quiz;
    let emojis = ['❌', '✅'];
    import { _ } from 'svelte-i18n';
    import { fade } from 'svelte/transition';
    import Icon from './Icon.svelte';
    import Loading from './Loading.svelte';
    import { get } from 'svelte/store';

    let waitTime = 800;
    if (get(quiz.isEvaluated)) {
        // only wait longer for the first time
        waitTime = 300;
    }
    let points = 0;
    beforeUpdate(() => (points = quiz.evaluate()));

    function format(n: number) {
        return n.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
        });
    }

    let gradedPoints = quiz.evaluate();
    let passed = false;
    if (quiz.config.passingGrade != undefined) {
      if( (Number(gradedPoints)/Number(quiz.questions.length) * 100) 
           >= Number(quiz.config.passingGrade) ) {
           passed = true;
      }
    }
 
</script>

<h3>{$_('resultsTitle')}</h3>
<Loading ms="{waitTime}" minHeight="{150}">
    <div in:fade="{{ duration: 1000 }}">
        <h1>
            <Icon name="check-double" />
            {format(points)}/{format(quiz.questions.length)}
        </h1>

        <ol>
            {#each quiz.questions as question, i}
                <li class="top-list-item" on:click="{() => {
                    if(quiz.config.enableRetry) {
                        quiz.jump(i);
                    }
                    }
                    }">
                    <span class="list-question">
                        {emojis[+question.solved]}
                        {@html question.text}
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
           <h2>
             {#if passed == true}
               {quiz.config.customPassMsg}
             {/if}
             {#if passed == false && quiz.config.passingGrade != undefined}
               {quiz.config.customFailMsg} 
             {/if}
           </h2> 
        </ol>
    </div>
</Loading>

<style>
    ol {
        padding-left: 0;
        display: inline-block;
    }

    .top-list-item {
        margin-bottom: 0.2rem;
        list-style-type: none;
        list-style: none;
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
