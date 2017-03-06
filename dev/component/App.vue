<template lang="html">
    <div class="app-container">
        <div class="video-container">
            <vue-video></vue-video>
        </div>
        <router-view></router-view>
    </div>
</template>

<script>
import VueVideo from './VueVideo.vue';
export default {
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
