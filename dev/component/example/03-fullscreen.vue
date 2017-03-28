<template lang="html">
    <div class="video-container">
        <vue-video ref="video1" :options="videoOptions"></vue-video>
    </div>
</template>

<script>
    import VueVideo from '../dev/component/VueVideo.vue';
    
    export default {
        data() {
            return {
                videoOptions: {
                    src: 'http://vjs.zencdn.net/v/oceans.mp4',
                    poster: 'image/2.jpg',
                    fullscreen: true,
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
      .video-container {
          position: relative;
          width: 100%;
          margin: 0 auto;
      }
</style>
