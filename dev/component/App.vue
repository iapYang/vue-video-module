<template lang="html">
    <div class="app-container">
        <router-view></router-view>
    </div>
</template>

<script>

export default {
    components: {
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
</style>
