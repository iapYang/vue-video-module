<template lang="html">
    <div class="app-container">
        <div class="video-container">
            <vue-video ref="video1" :options="videoOptions"></vue-video>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
import VueVideo from './VueVideo.vue';
export default {
    data() {
        return {
            videoOptions: {
                src: 'video/1.mp4',
                poster: 'image/1.jpg',
                playMain: 'image/play_op2.png',
                playMainRollover: 'image/play_rollover_op2.png',
                replayMain: 'image/replay_op2.png',
                replayMainRollover: 'image/replay_rollover_op2.png',
                controlBar: true,
                spinner: 'circles',
            },
        };
    },
    mounted() {
        const self = this;
        this.video1 = this.$refs.video1;
    },
    components: {
        VueVideo,
    },
};
</script>

<style lang="scss">
@import "../style/reset";
@import "../style/mixin";

@include font-face("Lato-Regular");

html,body {
    position: relative;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
}

#app, .app-container{
    position: relative;
    width: 100%;
    height: 100%;

}

.video-container {
    position: relative;
    width: 600px;
    margin: 0 auto;
}
</style>
