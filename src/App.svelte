<script lang="ts">
import ResultSection from './components/ResultSection.svelte';
import QuizSection from './components/QuizSection.svelte';
import Footer from './components/Footer.svelte';
import type { Quiz } from './quiz';
import ProgressBar from './components/ProgressBar.svelte'

export let quiz: Quiz;
$: finished = quiz.finished
</script>

<div class='quizdown-content'>
	<ProgressBar quiz={quiz}/>

{#if !$finished}
	<QuizSection quiz={quiz}></QuizSection>
{:else}
	<ResultSection quiz={quiz}></ResultSection>
{/if}

<Footer quiz={quiz}></Footer>

</div>

<style>
   :global(.quizdown-content) {
        font-family: 'Lucida Console', 'Courier New', monospace;
		width:100%;   
		display:flex;
		flex-direction: column;
		justify-content: center; 
    }

</style>