<script lang="ts">
    import { ResultsOverview } from '../resultsOverview';
    import { beforeUpdate } from 'svelte';
    import { _ } from 'svelte-i18n';
    import { fade } from 'svelte/transition';
    import Icon from './Icon.svelte';
    import Loading from './Loading.svelte';

    let resultsOverview = new ResultsOverview();
    // let showModal = false;

    let waitTime = 800;
    
    let overallPoints = 0;
    beforeUpdate(() => (overallPoints = resultsOverview.getOverallPoints()));
    console.log('overallPoints: ', overallPoints);

    let overallMaxPoints = 0;
    beforeUpdate(() => (overallMaxPoints = resultsOverview.getOverallMaxPoints()));
    console.log('overallMaxPoints: ', overallMaxPoints);

    function format(n: number) {
        return n.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
        });
    }
</script>

<h3>{$_('overviewTitle')}</h3>
<Loading ms="{waitTime}" minHeight="{150}">
    <div in:fade="{{ duration: 1000 }}">
        <h1>
            <Icon name="check-double" />
            {format(overallPoints)}/{format(overallMaxPoints)}
        </h1>

        <ol>
            {#each resultsOverview.getQuizesNames() as quizName, i}
                <li class="top-list-item">
                    {#if (parseInt(localStorage.getItem(quizName + '.score'))/parseInt(localStorage.getItem(quizName + '.maxScore')) == 1)} 
                        <span class="list-quiz all-answers-correct">
                            {quizName}: {localStorage.getItem(quizName + '.score')}/{localStorage.getItem(quizName + '.maxScore')}
                        </span>
                    {:else if (parseInt(localStorage.getItem(quizName + '.score')) == 0 )}
                        <span class="list-quiz no-answer-correct">
                            {quizName}: {localStorage.getItem(quizName + '.score')}/{localStorage.getItem(quizName + '.maxScore')}
                        </span>
                    {:else}
                        <span class="list-quiz some-answers-correct">
                            {quizName}: {localStorage.getItem(quizName + '.score')}/{localStorage.getItem(quizName + '.maxScore')}
                        </span>
                    {/if}
                        
                </li>
            {/each}
        </ol>
    </div>
</Loading>

<style>
    ol {
        padding-left: 0;
        display: inline-block;
        margin-bottom: 1rem;
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

    .all-answers-correct {
        color: green;
        font-weight: bold;
    }

    .some-answers-correct {
        color: darkgoldenrod;
    }

    .no-answer-correct {
        color: darkred;
    }
</style>
