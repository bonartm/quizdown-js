<script>
    // adapted from https://svelte.dev/repl/3bf15c868aa94743b5f1487369378cf3?version=3.21.0
    export let data;
    import { flip } from 'svelte/animate';
    import Icon from 'svelte-awesome';
    import { arrowsAlt } from 'svelte-awesome/icons';

    let list = data['answers'][0].map((x, i) => ({ id: i, name: x }));

    let hovering = false;

    const drop = (event, target) => {
        event.dataTransfer.dropEffect = 'move';
        const start = parseInt(event.dataTransfer.getData('text/plain'));
        const newTracklist = list;

        if (start < target) {
            newTracklist.splice(target + 1, 0, newTracklist[start]);
            newTracklist.splice(start, 1);
        } else {
            newTracklist.splice(target, 0, newTracklist[start]);
            newTracklist.splice(start + 1, 1);
        }
        list = newTracklist;
        hovering = null;
    };

    const dragstart = (event, i) => {
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.dropEffect = 'move';
        const start = i;
        event.dataTransfer.setData('text/plain', start);
    };

    function check_solution(user_answers, true_answers) {
        return (
            true_answers.length === user_answers.length &&
            true_answers.every((val, index) => val === user_answers[index])
        );
    }

    $: correct = check_solution(
        list.map((x) => x['name']),
        data['answers'][0]
    );
</script>

<div class="list">
    {#each list as n, index (n.name)}
        <div
            class="list-item"
            animate:flip="{{ duration: 350 }}"
            draggable="{true}"
            on:dragstart="{(event) => dragstart(event, index)}"
            on:drop|preventDefault="{(event) => drop(event, index)}"
            ondragover="return false"
            on:dragenter="{() => (hovering = index)}"
            class:is-active="{hovering === index}">
            <Icon data="{arrowsAlt}" style="float: right;color: gray;" />
            {n.name}
        </div>
    {/each}
</div>

{#if correct}Yeah that's right!{:else}This is not correct :({/if}

<style>
    .list-item {
        display: block;
        padding: 1em;
        margin: 10px;
        background-color: lightgray;
        box-shadow: 3px 3px orange, 2px 2px orange, 1px 1px orange;
        cursor: move;
    }

    .list-item.is-active {
        background-color: #db9717;
        transform: translate(3px, 3px);
        box-shadow: none;
    }
</style>
