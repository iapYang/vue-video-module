<template lang="html">
    <div class="app-container">
        <div class="video-container">
            <vue-video ref="video1" :options="videoOptions"></vue-video>
        </div>
    </div>
</template>

<script>
// import VueVideo from '../../dist/bundle.js';
import VueVideo from './VueVideo.vue';
export default {
    data() {
        return {
            videoOptions: {
                src: 'http://vjs.zencdn.net/v/oceans.mp4',
                poster: 'http://www.freemake.com/blog/wp-content/uploads/2015/06/videojs-logo.jpg',
                // src: 'video/1.mp4',
                // poster: 'image/1.jpg',
                controlBar: true,
                spinner: 'circles',
                fullscreen: true,
                onPlayToPause(vueVideo) {
                    console.log(vueVideo);
                },
            },
        };
    },
    mounted() {
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
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
}
</style>
