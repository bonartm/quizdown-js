<script lang="ts">
import MultipleChoice from './components/MultipleChoiceView.svelte';
import Result from './components/Result.svelte';
import Footer from './components/Footer.svelte';
import type { Quiz } from './quiz';
import SequenceView from './components/SequenceView.svelte';
import MultipleChoiceView from './components/MultipleChoiceView.svelte'
import BlanksView from './components/BlanksView.svelte'
import PairsView from './components/PairsView.svelte'
import ProgressBar from './components/ProgressBar.svelte'

export let quiz: Quiz;
$: finished = quiz.finished
$: counter = quiz.counter
$: current = quiz.questions[$counter]
$: show_hint = false

const views = {
	'MultipleChoice': MultipleChoiceView,
	'Sequence': SequenceView,
	'Gaps': BlanksView,
	'Pairs': PairsView
}
</script>

<svelte:head>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.6.0/styles/github.min.css">
</svelte:head>

<div class="container">
	<div class="main">

		<ProgressBar current="{$counter+1}" max="{counter.max}" />
	
	
		{#if !$finished}
			<h2>{$counter+1}/{counter.max}: {@html current.text}</h2>
	
			<div class:disabled="{current.explanation === null || current.explanation === ''}" class="explanation">
				{@html current.explanation}
			</div>
	
			<div class:disabled="{current.hint === null || current.hint === ''}" class='hint'>
				<button on:click={() => show_hint=!show_hint}>?</button>
				{#if show_hint}{@html current.hint}{/if}
			</div>
	
			<svelte:component this={views[current.constructor.name]} quiz={quiz}/>
		{:else}
			<Result quiz={quiz}></Result>
		{/if}
	</div>
	
	<div class="footer"><Footer quiz={quiz}></Footer></div>
	


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
	
	.hint {
		display:inline-block;
	}	

	.disabled {
		display: none;
	}

	.main{
		width:600px;
	}
	.footer{
		width:600px;
	}
</style>