<script lang="ts">
    import { onMount, beforeUpdate, afterUpdate } from 'svelte';
    import {
        parse,
        icon,
        findIconDefinition,
    } from '@fortawesome/fontawesome-svg-core';
    //https://stackoverflow.com/questions/56334381/why-my-font-awesome-icons-are-being-displayed-big-at-first-and-then-updated-to-t

    import type {
        IconName,
        IconParams,
        IconLookup,
    } from '@fortawesome/fontawesome-svg-core';

    export let size = undefined;
    export let spin = false;
    export let name: IconName;
    export let solid = true;

    let prefix = solid ? 'fas' : 'far';

    let params: IconParams = {
        classes: [
            size ? `fa-${size}` : undefined,
            spin ? 'fa-spin' : undefined,
        ],
    };

    let html = '';
    beforeUpdate(() => {
        let iconObj = { prefix: prefix, iconName: name } as IconLookup;
        const result = icon(iconObj, params);
        html = result.html[0];
    });
</script>

{@html html}
