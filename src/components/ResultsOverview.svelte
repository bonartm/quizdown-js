<script lang="ts">
    import { ResultsOverview } from '../resultsOverview';
    import { beforeUpdate } from 'svelte';
    import type { Quiz } from '../quiz';
    let emojis = ['❌', '✅'];
    import { _ } from 'svelte-i18n';
    import { fade } from 'svelte/transition';
    import Icon from './Icon.svelte';
    import Loading from './Loading.svelte';
    import { onMount } from 'svelte';
    import registerIcons from '../registerIcons';

    registerIcons();

    let node: HTMLElement;
    let minHeight = 150;
    let reloaded = false;
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
                    <span class="list-quiz">
                        {quizName}
                    </span>
                    <p>
                        {localStorage.getItem(quizName + '.score')}/{localStorage.getItem(quizName + '.maxScore')}
                    </p>
                </li>
            {/each}
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
