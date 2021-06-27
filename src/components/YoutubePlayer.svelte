<script lang="ts">
    // https://developers.google.com/youtube/iframe_api_reference

    import { createEventDispatcher, onMount } from 'svelte';
    export let player: YT.Player;
    export let options: YT.PlayerVars;

    const dispatch = createEventDispatcher();
    let player_node: HTMLElement;

    function init_library() {
        //only init if not allready done
        if (globalThis.iframeApiReady === undefined) {
            let tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            let firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            globalThis.onYouTubeIframeAPIReady = () => {
                globalThis.dispatchEvent(new Event('iframeApiReady'));
                globalThis.iframeApiReady = true;
            };
        }
    }

    async function init_player() {
        // check if library was allready loaded in the past
        if (globalThis.iframeApiReady) {
            new_player();
        } else {
            // wait until the library is loaded
            globalThis.addEventListener('iframeApiReady', new_player);
        }
    }

    function new_player() {
        player = new YT.Player(player_node, {
            height: '350',
            width: '100%',
            playerVars: options,
            events: {
                onReady: () => dispatch('ready'),
                onStateChange: (e) =>
                    dispatch('stateChange', { data: e['data'] }),
            },
        });
    }
    init_library();
    onMount(init_player);
</script>

<div class="youtube-player">
    <div bind:this="{player_node}"></div>
</div>
