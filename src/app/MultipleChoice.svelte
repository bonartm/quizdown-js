<script>
    export let data;
    // import { quiz_results } from 'Quiz.svelte';
    let user_answers = [];

    function check_solution(user_answers) {
        let true_answers = [];
        for (let i = 0; i < data['answers'].length; i++) {
            if (data['answers'][i]['is_right'][0]) true_answers.push(i);
        }
        return (
            true_answers.length === user_answers.length &&
            true_answers.every((val, index) => val === user_answers[index])
        );
    }

    $: correct = check_solution(user_answers);
    // quiz_results.push($correct)
</script>

<!-- {current_idx+1}/{max_idx-1}: {quiz_data[current_idx]['data']['question']} -->

{#each data['answers'] as answer, i}
    <label>
        <input type="checkbox" bind:group="{user_answers}" value="{i}" />
        <span>{answer['text']}</span>
    </label>
{/each}

{#if correct}Yeah that's right!{:else}This is not correct :({/if}

<style>
    label [type='checkbox'] {
        display: none;
    }

    [type='checkbox'] + span {
        transition-duration: 0.1s;
        background-color: lightgray;

        box-shadow: 3px 3px orange, 2px 2px orange, 1px 1px orange;

        display: block;
        padding: 1em;
        margin: 5px;
    }

    [type='checkbox']:active + span {
        background-color: #db9717;
        transform: translate(3px, 3px);
        box-shadow: none;
    }

    [type='checkbox']:hover:not(:checked):not(:active) + span {
        background-color: #cfcfcf;
    }

    [type='checkbox']:checked + span {
        background-color: #db9717;
        transform: translate(3px, 3px);
        box-shadow: none;
    }
</style>
