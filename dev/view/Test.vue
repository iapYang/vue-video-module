<template lang="html">
    <div class="test-container">
        <top></top>
        <div class="video-container container">
            <vue-video ref="video1" :options="videoOptions"></vue-video>
        </div>
    </div>
</template>

<script>
    import VueVideo from '../component/VueVideo.vue';
    import Top from '../component/Top.vue';
    
    export default {
        data() {
            return {
                videoOptions: {
                    src: 'http://vjs.zencdn.net/v/oceans.mp4',
                    poster: 'http://www.freemake.com/blog/wp-content/uploads/2015/06/videojs-logo.jpg',
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
            Top,
        },
    };
</script>

<style lang="scss" scoped>  
    .test-container .video-container {
        position: relative;
        width: 100%;
        max-width: 800px;
        margin: 0 auto;
    }
</style>
