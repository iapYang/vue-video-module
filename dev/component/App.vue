<template lang="html">
    <div class="app-container">
        <header>
            <md-toolbar>
                <h1 class="md-title">Vue-video-module</h1>
            </md-toolbar>
        </header>
        <div class="banner">
            <h2>Vue-video-module</h2>
            <h4>Simple video component bulit for vue</h4>
            <ul class="actions">
                <li class="action" v-for="action,index in actions" :key="action">
                    <a :href="action.href" target="_blank">
                        <md-button :class="action.class">{{ action.name }}</md-button>
                    </a>
                </li>
            </ul>
        </div>
        <div class="examples container">
            <md-card>
                <md-card-header>
                    <div class="md-subhead">Subtitle here</div>
                </md-card-header>
                <div class="md-card-main">
                    <div class="video-container container">
                        <vue-video ref="video1" :options="videoOptions"></vue-video>
                    </div>
                </div>
            </md-card>
        </div>
        <div class="video-container container">
            <vue-video ref="video1" :options="videoOptions"></vue-video>
        </div>
        <div class="codemirror-container container">
            <codemirror :code="code" :options="editorOption"></codemirror>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import VueVideo from './VueVideo.vue';
    import VueMaterial from 'vue-material';
    import 'vue-material/dist/vue-material.css';
    
    Vue.use(VueMaterial);
    
    import {
        codemirror,
        CodeMirror,
    } from 'vue-codemirror';
    
    export default {
        data() {
            return {
                actions: [{
                    name: 'view on github',
                    href: 'https://github.com/iapYang/vue-video-module',
                    class: 'md-primary',
                }, {
                    name: 'github issues',
                    href: 'https://github.com/iapYang/vue-video-module/issues',
                    class: 'md-accent',
                }, {
                    name: 'API',
                    href: 'https://github.com/iapYang/vue-video-module/blob/master/README.md',
                    class: 'md-primary',
                }],
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
                    hintOptions: {
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
    html,
    body {
        position: relative;
        width: 100%;
        height: 100%;
        overflow-x: hidden;
        margin: 0;
        padding: 0;
        border: 0;
    }
    
    #app,
    .app-container {
        position: relative;
        width: 100%;
        height: 100%;
        min-width: 768px;
    }
    
    .banner {
        h2 {
            // font-family: "Lato-Regular";
            text-transform: uppercase;
            font-size: 35px;
            text-align: center;
            color: #000;
            line-height: 1;
        }
        h4 {
            // font-family: "Lato-Regular";
            text-transform: capitalize;
            font-size: 25px;
            text-align: center;
            color: #a5a5a5;
            margin-bottom: 0;
            line-height: 1;
        }
        .actions {
            position: relative;
            text-align: center;
            li {
                display: inline-block;
            }
        }
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
