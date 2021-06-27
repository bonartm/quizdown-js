<script lang="ts">
    // https://developers.google.com/youtube/iframe_api_reference

    import YoutubePlayer from './YoutubePlayer.svelte';
    import type { Quiz } from '../quiz';
    export let quiz: Quiz;

    $: counter = quiz.counter;
    $: current = quiz.questions[$counter];
    let player: YT.Player;
    let ready = false;

    // https://developers.google.com/youtube/player_parameters#Parameters
    const yt_player_options: YT.PlayerVars = {
        autoplay: 0,
        playsinline: 1,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
    };

    $: {
        if (ready) {
            player.cueVideoById({
                videoId: quiz.config.video_id,
                startSeconds: current.options.start_seconds,
                endSeconds: current.options.end_seconds,
            });
        }
    }

    function on_ready(event) {
        ready = true;
    }

    function toggleVideo() {
        let seconds = player.getCurrentTime();
        if (seconds >= current.options.end_seconds) {
            player.seekTo(current.options.start_seconds, true);
        }
        if (player.getPlayerState() === YT.PlayerState.PLAYING) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }
    }

    function on_state_change(e) {
        // console.log(e.detail.data);
    }
</script>

<YoutubePlayer
    bind:player
    on:ready="{on_ready}"
    on:stateChange="{(e) => on_state_change(e)}"
    options="{yt_player_options}"
/>

{#if ready}
    <button on:click="{toggleVideo}">Play/Pause</button>
    {current.options.start_seconds}-{current.options.end_seconds}
{/if}
