<template lang="html">
    <div class="dragdealer" ref="dragdealer">
        <div class="handle"></div>
        <div class="bar" :style="{height: barHeight}"></div>
    </div>
</template>

<script>
import Dragdealer from 'dragdealer';

export default {
    data() {
        return {
            layerY: 1,
        };
    },
    computed: {
        barHeight() {
            return `${this.layerY.toFixed(4) * 100}%`;
        },
    },
    mounted() {
        // add refer to this
        const self = this;

        this.dragdealer = new Dragdealer(this.$refs.dragdealer, {
            horizontal: false,
            vertical: true,
            animationCallback(x, y) {
                self.layerY = 1 - y;

                self.$emit('volumechange', y);
            },
        });
    },
    methods: {
        muteHandler(y) {
            this.dragdealer.setValue(0, y, true);
        },
        reflow() {
            this.dragdealer.reflow();
        },
    },
};
</script>

<style lang="scss" scoped>
    .dragdealer {
        position: relative;
        width: 4px;
        height: 100%;
        background-color: #48391b;
        margin: 0 auto;

        .handle {
            position: absolute;
            top: 0px;
            left: -4px;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background-color: #d5a83d;
            z-index: 2;
        }

        .bar {
            position: absolute;
            top: auto;
            bottom: 0;
            left: 0;
            width: 100%;
            background-color: #d5a83d;
            z-index: 1;
        }
    }
</style>
