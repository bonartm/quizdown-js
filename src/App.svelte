<script lang="ts">
import QuizSection from './components/QuizSection.svelte';
import Footer from './components/Footer.svelte';
import type { Quiz } from './quiz';
import type { AppConfig} from './parser';
import ProgressBar from './components/ProgressBar.svelte'
import { onMount } from 'svelte';

export let quiz: Quiz;
export let id: string;
export let options: AppConfig;


// set global options
onMount(async () => {
	let primary_color: string = options['primary_color'] || '#FF851B';
	let secondary_color: string = options['secondary_color'] || '#DDDDDD';
	let title_color: string = options['title_color'] || 'black';

	let node: HTMLElement = document.getElementById(id);
	node.style.setProperty('--quizdown-color-primary', primary_color);
	node.style.setProperty('--quizdown-color-secondary', secondary_color);
	node.style.setProperty('--quizdown-color-title', title_color);
});

</script>

<div class='quizdown-content' id='{id}'>
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