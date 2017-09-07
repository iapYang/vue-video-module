<template>
    <vue-video :options="videoOptions" />
</template>

<script>
import VueVideo from '../../../bundle/index.js';

export default {
    data() {
        return {
            videoOptions: {
                src: 'http://vjs.zencdn.net/v/oceans.mp4',
            },
        };
    },
    components: {
        VueVideo,
    },
};
</script>
