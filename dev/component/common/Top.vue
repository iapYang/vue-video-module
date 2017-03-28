<template lang="html">
    <header>
        <md-toolbar>
            <h1 class="md-title">Vue-video-module</h1>
            <md-button v-if="showButton" href="#/">
                Back to Main Page
            </md-button>
        </md-toolbar>
    </header>
</template>

<script>
export default {
    props: {
        showButton: {
            default: false,
        },
    },
};
</script>

<style lang="scss" scoped>
    .md-toolbar {
        justify-content: space-between;
    }
</style>
