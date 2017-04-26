<template lang="html">
    <div class="test-container">
        <top :showButton="true"></top>
        <div class="test-main">
            <div class="field-group">
                <md-input-container v-for="select,index in selects" key="select">
                    <label :for="select.name">{{ select.name }}</label>
                    <md-select :name="select.name" :id="select.name" @change="changeHandler(select.name, $event)" v-model="defaultVal[select.name]">
                        <md-option v-for="option,i in select.options" :value="option" key="option">
                            {{ option }}
                        </md-option>
                    </md-select>
                </md-input-container>
            </div>
            <transition name="video" @enter="videoEnterHandler" @leave="videoLeaveHandler">
                <div class="video-container" v-show="is_video_show">
                    <vue-video :options="videoOptions" ref="video" @init="initHandler" @end="handler"></vue-video>
                </div>
            </transition>
        </div>
    </div>
</template>

<script>
    import VueVideo from '../src/VueVideo.vue';
    import Top from '../common/Top.vue';
    
    export default {
        data() {
            const selects = [{
                name: 'src',
                options: [
                    'https://media.w3.org/2010/05/sintel/trailer.mp4',
                    'http://vjs.zencdn.net/v/oceans.mp4',
                ],
            }, {
                name: 'poster',
                options: [
                    'https://media.w3.org/2010/05/sintel/poster.png',
                    'image/2.jpg',
                    'false',
                ],
            }, {
                name: 'endFrame',
                options: [
                    'https://media.w3.org/2010/05/sintel/poster.png',
                    'image/2.jpg',
                    'false',
                ],
            }, {
                name: 'loop',
                options: ['false', 'true'],
            }, {
                name: 'volume',
                options: ['true', 'false'],
            }, {
                name: 'controlBar',
                options: ['true', 'false'],
            }, {
                name: 'fullscreen',
                options: ['true', 'false'],
            }];

            const videoOptions = {};
            const defaultVal = {};

            selects.forEach(select => {
                let val = select.options[0];

                defaultVal[select.name] = val;

                if (val === 'true' || val === 'false') {
                    val = val === 'true';
                }

                videoOptions[select.name] = val;
            });

            const self = this;

            return {
                defaultVal,
                videoOptions: Object.assign({}, videoOptions),
                selects,
                is_video_show: true,
            };
        },
        mounted() {
            this.video = this.$refs.video;
        },
        methods: {
            handler(vueVideo) {
                console.log('=================', vueVideo);
            },
            changeHandler(name, value) {
                // if this.video is not be mounted
                if (!this.video) return;

                console.log('name', name, 'value', value);
                
                let processed = value;
                if (value === 'false') processed = false;
                if (value === 'true') processed = true;
                
                if (name === 'src') {
                    // if the change choice is src
                    console.log('changing video src');

                    if (value !== this.videoOptions[name]) {
                        this.video.pause();
                        this.is_video_show = false;

                        // wait for videoLeaveHandler
                    }
                } else {
                    const temporary = {};
                    temporary[name] = processed;
                    this.video.change(temporary);
                }

                this.videoOptions[name] = processed;
            },
            initHandler(vueVideo) {
                console.log(vueVideo);
                vueVideo.loadPoster();
                self.is_video_show = true;
            },
            videoEnterHandler() {
                console.log('video transition to opc 1');
            },
            videoLeaveHandler() {
                console.log('video transition to opc 0');

                // reset video state
                this.video.reset();

                setTimeout(() => {
                    this.video.change({
                        src: this.videoOptions.src,
                    });
                }, 500);
            },
        },
        components: {
            VueVideo,
            Top,
        },
    };
</script>

<style lang="scss" scoped>
    .video-enter-active {
        transition: opacity 0.4s;
    }
    .video-leave-active {
        transition: opacity 0.6s;
    }
    /* .video-leave-active in <2.1.8 */
    .video-enter,
    .video-leave-to {
        opacity: 0;
    }
    $mLenght: 20px;
    h2 {
        margin-left: $mLenght;
    }
    .test-main {
        position: relative;
        .field-group {
            display: flex;
            .md-input-container {
                position: relative;
                max-width: 300px;
                margin-right: $mLenght;
                &:nth-child(1) {
                    margin-left: $mLenght;
                }
                label {
                    text-transform: capitalize;
                }
            }
        }
        .video-container {
            position: relative;
            width: 70%;
            max-width: 1100px;
            margin: 0 auto;
        }
    }
</style>
