<script>
    export let data;

    import { draggable } from './dragdrop.js';
    import { crossfade } from 'svelte/transition';
    import { quintOut, elasticOut } from 'svelte/easing';
    import { flip } from 'svelte/animate';

    const shelf = data['answers'][0].map((x, i) => ({ id: i, name: x }));

    function putInShelf(item, index) {
        const oldItem = shelf[index];
        const oldShelfIndex = shelf.indexOf(item);
        if (oldShelfIndex !== -1) shelf[oldShelfIndex] = oldItem;
        shelf[index] = item;
    }

    const [send, receive] = crossfade({
        duration: (d) => Math.sqrt(d * 500),
        easing: elasticOut,
        fallback(node, params) {
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;

            return {
                duration: 600,
                easing: quintOut,
                css: (t) => `
			transform: ${transform} scale(${t});
			opacity: ${t}
		  `,
            };
        },
    });

    function check_solution(shelf, answers) {
        console.log(shelf);
        console.log(answers);
        return true;
    }

    $: correct = check_solution(shelf, data['answers'][0]);
</script>

<div class="shelf">
    {#each shelf as item, index}
        <span class="slot" on:dropped="{(e) => putInShelf(e.detail, index)}">
            {#if item}
                {#each [item] as item (item.id)}
                    <span
                        class="item"
                        use:draggable="{{ data: item, targets: ['.slot', '.slot .item'] }}"
                        in:receive="{item.id}"
                        out:send="{item.id}"
                        animate:flip
                        on:dropped="{(e) => putInShelf(e.detail, index)}">
                        {item.name}
                    </span>
                {/each}
            {/if}
        </span>
    {/each}
</div>

{#if correct}Yeah that's right!{:else}This is not correct :({/if}

<style>
    .slot {
        background-color: lightgray;
        box-shadow: 3px 3px orange, 2px 2px orange, 1px 1px orange;
        padding: 0.2em;
        margin: 5px;
        display: block;
    }

    .item {
        display: block;
        padding: 1em;
        margin: 10px;
        position: relative;
        background: rgba(255, 255, 255, 0.5);
        box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2);
        cursor: move;
    }

    :global(.item.dragged) {
        pointer-events: none;
        z-index: 10000;
        background: rgba(219, 151, 23, 0.7);
    }

    :global(.item.droptarget) {
        background: rgba(219, 151, 23, 1);
    }
</style>
