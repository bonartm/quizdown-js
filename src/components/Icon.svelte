<script lang="ts">
    import { onMount, beforeUpdate } from 'svelte';
    import {
        parse,
        icon,
        findIconDefinition,
    } from '@fortawesome/fontawesome-svg-core';

    import type {
        IconName,
        IconParams,
        IconLookup,
    } from '@fortawesome/fontawesome-svg-core';

    export let size = undefined;
    export let name: IconName;

    let params: IconParams = {
        classes: size ? `fa-${size}` : undefined,
    };

    let html = '';
    let iconObj = { prefix: 'fas', iconName: name } as IconLookup;
    const result = icon(iconObj, params);
    html = result.html[0];
</script>

{@html html}

<style>
    /* i have to load the styles manually, maybe due to the shadow dom? */
    @import 'https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-svg-core/styles.css';
</style>
