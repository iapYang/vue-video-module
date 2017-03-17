<template lang="html">
    <div class="app-container">
        <div class="video-container container">
            <vue-video ref="video1" :options="videoOptions"></vue-video>
        </div>
        <div class="codemirror-container container">
            <codemirror :code="code" :options="editorOption"></codemirror>
        </div>
    </div>
</template>

<script>
import VueVideo from './VueVideo.vue';

import {codemirror, CodeMirror} from 'vue-codemirror';

export default {
    data() {
        return {
            videoOptions: {
                src: 'http://vjs.zencdn.net/v/oceans.mp4',
                poster: 'http://www.freemake.com/blog/wp-content/uploads/2015/06/videojs-logo.jpg',
                fullscreen: true,
                onStart(vueVideo) {
                    console.log(vueVideo);
                },
            },
            code: `// example
export default {
    data() {
        return {
            videoOptions: {
                src: 'http://vjs.zencdn.net/v/oceans.mp4',
                poster: 'http://www.freemake.com/blog/wp-content/uploads/2015/06/videojs-logo.jpg',
                fullscreen: true,
                onStart(vueVideo) {
                    console.log(vueVideo);
                },
            },
        };
    },
};`,
            editorOption: {
                tabSize: 4,
                styleActiveLine: true,
                lineNumbers: true,
                line: true,
                foldGutter: true,
                styleSelectedText: true,
                gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
                highlightSelectionMatches: {
                    showToken: /w/,
                    annotateScrollbar: true,
                },
                mode: 'text/javascript',
                hintOptions:{
                    completeSingle: false,
                },
                keyMap: 'sublime',
                matchBrackets: true,
                showCursorWhenSelecting: true,
                theme: 'monokai',
                extraKeys: {
                    Ctrl: 'autocomplete',
                },
            },
        };
    },
    mounted() {
        this.video1 = this.$refs.video1;

        console.log(this.code);
    },
    components: {
        VueVideo,
        codemirror,
    },
};
</script>

<style lang="scss">
// @import "../style/reset";
@import "../style/mixin";

@include font-face("Lato-Regular");

html,body {
    position: relative;
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    margin: 0;
    padding: 0;
    border: 0;
}

#app, .app-container{
    position: relative;
    width: 100%;
    height: 100%;
}

.title {
    font-family: "Lato-Regular";
    font-size: 50px;
    text-align: center;
}

.container {
    position: relative;
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
}

.codemirror-container {
    margin-top: 50px;
}
</style>
