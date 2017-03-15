<template lang="html">
    <div class="volume-progress">
        <volume-bar></volume-bar>
    </div>
</template>

<script>
import VolumeBar from './VueVideo/VolumeBar.vue';
export default {
    components: {
        VolumeBar,
    },
};
</script>

<style lang="scss" scoped>
    .volume-progress {
        position: relative;
        height: 100px;
        width: 50px;
        padding: 10px 0;
        opacity: 1;
        transition: all ease 0.3s;
    }
</style>
