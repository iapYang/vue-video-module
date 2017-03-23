<template lang="html">
    <div class="main-container">
        <header>
            <md-toolbar>
                <h1 class="md-title">Vue-video-module</h1>
            </md-toolbar>
        </header>
        <div class="banner">
            <h4>Simple video component bulit for vue</h4>
            <ul class="actions">
                <li class="action" v-for="action,index in actions" :key="action">
                    <a :href="action.href" target="_blank">
                        <md-button :class="action.class">{{ action.name }}</md-button>
                    </a>
                </li>
            </ul>
        </div>
        <div class="examples">
            <md-card v-for="example,index in examples" :key="example">
                <md-card-header>
                    <div class="md-subhead">{{ example.title }}</div>
                </md-card-header>
                <div class="md-card-main">
                    <div :is="example.name"></div>
                </div>
            </md-card>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import VueMaterial from 'vue-material';
    import 'vue-material/dist/vue-material.css';
    
    import example01 from '../../example/01-default.vue';
    import example02 from '../../example/02-autoPlay.vue';
    import example03 from '../../example/03-fullscreen.vue';
    
    Vue.use(VueMaterial);
    
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
                    name: 'example',
                    href: 'https://github.com/iapYang/vue-video-module/tree/master/example',
                    class: 'md-primary',
                }, {
                    name: 'API',
                    href: 'https://github.com/iapYang/vue-video-module/blob/master/README.md',
                    class: 'md-primary',
                }],
                examples: [{
                    title: '01-Default',
                    name: 'example01',
                }, {
                    title: '02-AutoPlay',
                    name: 'example02',
                }, {
                    title: '03-Fullscreen',
                    name: 'example03',
                }],
            };
        },
        components: {
            example01,
            example02,
            example03,
        },
    };
</script>

<style lang="scss">
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
       
       .examples {
           position: relative;
           width: 100%;
           max-width: 1024px;
           margin: 0 auto;
           .md-card {
               margin-top: 20px;
               &:nth-child(1) {
                   margin-top: 0;
               }
               .md-card-main {
                   position: relative;
                   display: flex;
                   flex-direction: row;
                   justify-content: space-between;
                   flex-wrap: nowrap;
                   align-items: flex-start;
               }
           }
       }
</style>
