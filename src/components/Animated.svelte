<script lang="ts">
    import { fade } from 'svelte/transition';
    export let update: any;

    // function fixPosition(node, { delay = 0, duration = 400, width = 300 }) {
    //     return {
    //         delay,
    //         duration,
    //         css: function (t) {
    //             return `height: 0px; overflow:hidden;`;
    //         },
    //     };
    // }
</script>

{#key update}
    <div class="animated" in:fade|global="{{ duration: 400 }}">
        <slot />
    </div>
{/key}

<style>
</style>
