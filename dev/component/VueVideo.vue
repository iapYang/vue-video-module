<template lang="html">
    <div class="vue-video">
        <div class="main-part part">
            <div class="video-placeholder"></div>
            <video
             src="video/1.mp4"
             class="main-component"
             >
            </video>
            <div class="video-poster main-component">
                <img src="image/1.jpg" alt="">
            </div>
        </div>
        <div class="part">

        </div>
    </div>
</template>

<script>
export default {
};
</script>

<style lang="scss" scoped>
    .vue-video {
        position: relative;
        width: 100%;
        cursor: pointer;

        img {
            position: relative;
            display: block;
            width: 100%;
        }

        .part {
            position: relative;
            width: 100%;
        }

        .main-part {
            .video-placeholder {
                display: block;
                position: relative;
                padding-bottom: 56.25%;
            }

            .main-component {
                position: absolute;
                width: 100%;
                left: 0;
                top: 0;
            }
        }
    }
</style>
