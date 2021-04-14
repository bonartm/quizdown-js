<script lang="ts">
import QuizSection from './components/QuizSection.svelte';
import Footer from './components/Footer.svelte';
import type { Quiz } from './quiz';
import ProgressBar from './components/ProgressBar.svelte'
import { onMount } from 'svelte';

export let quiz: Quiz;

let node: HTMLElement;

// set global options
onMount(async () => {
	let primary_color: string = quiz.config['primary_color'];
	let secondary_color: string = quiz.config['secondary_color'];
	let title_color: string = quiz.config['title_color'];

	node.style.setProperty('--quizdown-color-primary', primary_color);
	node.style.setProperty('--quizdown-color-secondary', secondary_color);
	node.style.setProperty('--quizdown-color-title', title_color);
});

</script>

<div class='quizdown-content' bind:this={node}>
	<ProgressBar quiz={quiz}/>
	<QuizSection quiz={quiz}></QuizSection>
	<Footer quiz={quiz}></Footer>
</div>

<style>
   :global(.quizdown-content) {
	   	margin:auto;
	    max-width: 700px;
		width:100%;  	 
		display:flex;
		flex-direction: column;
		justify-content: center; 
		font-family: 'Lucida Console', 'Courier New', monospace;
		padding:1em;
		margin-top:1em;
		margin-bottom:1em;
	}
</style>