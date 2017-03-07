<template lang="html">
    <div class="vue-video">
        <div
         class="main-part part"
         @click="videoClickHandler"
         >
            <div class="video-placeholder"></div>
            <video
             :src="videoOptions.src"
             class="main-component"
             ref="video"
             @timeupdate="timeupdateHandler"
             @webkitendfullscreen="videoPauseHandler"
             >
            </video>
            <transition name="fade">
                <div
                 class="video-poster main-component"
                 v-if="videoOptions.poster"
                 v-show="is_video_BFF && !is_video_played">
                    <transition name="fade">
                        <img :src="videoOptions.poster" v-show="is_poster_loaded" alt="">
                    </transition>
                </div>
            </transition>
            <div class="video-main-controller main-component">
                <div
                 class="play-container rollover-container"
                 v-show="!showReplay && !is_video_play"
                 v-if="!ifIphone && videoOptions.playMain"
                 >
                    <div class="hover">
                        <img :src="videoOptions.playMainRollover" alt="">
                    </div>
                    <div class="normal">
                        <img :src="videoOptions.playMain" alt="">
                    </div>
                </div>
                <div
                 class="replay-container rollover-container"
                 v-show="showReplay && !is_video_play"
                 v-if="!ifIphone && videoOptions.replayMain"
                 >
                    <div class="hover">
                        <img :src="videoOptions.replayMainRollover" alt="">
                    </div>
                    <div class="normal">
                        <img :src="videoOptions.replayMain" alt="">
                    </div>
                </div>
                <div
                 class="video-loading rollover-container vue-loading-container"
                 v-show="is_video_play && is_video_buffering"
                 >
                    <vue-loading spinner="circles"></vue-loading>
                </div>
            </div>
        </div>
        <div class="part video-sub-controller">
            <div class="button-container" @click="videoClickHandler">
                <div
                 class="button preload play"
                 v-show="!showReplay && !is_video_play"
                 >
                     <img src="image/play.png" alt="">
                 </div>
                <div
                 class="button preload pause"
                 v-show="!showReplay && is_video_play"
                 >
                     <img src="image/pause.png" alt="">
                 </div>
                <div
                 class="button preload"
                 v-show="showReplay"
                 >
                     <img src="image/replay.png" alt="">
                 </div>
            </div>
            <div class="progress-bar" @click="barClickHandler">
                <div class="seek-bar">
                    <div class="play-bar" :style="{width: progress}"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Platform from '../script/plugin/platform.js';
import PictureLoader from '../script/plugin/pictureLoader.js';

import VueLoading from 'vue-simple-loading';

function floatToPercent(number) {
    return `${number.toFixed(4) * 100}%`;
}

export default {
    data() {
        return {
            // if video played to control first frame
            is_video_played: false,

            // if the video is playing
            is_video_play: false,

            // should show the replay btn
            showReplay: false,

            // if the poster of loaded
            is_poster_loaded: false,

            // control bar progress
            progress: '0%',

            // check the platform if mobile
            ifMobile: Platform.isMobile,

            // if the mobile rotate
            ifRotate: false,

            // if platform is iphone
            ifIphone: Platform.isiPhone,

            // if the video is buffering
            is_video_buffering: false,

            // requestAnimation id
            requestId: 0,

            // if the video is buffering at the first frame
            is_video_BFF: true,

            // video options
            videoOptions: {
                // source of video (required)
                src: this.options.src,

                // poster
                poster: this.options.poster,

                // main play button
                playMain: this.options.playMain,
                playMainRollover: this.options.playMainRollover || this.options.playMain,

                // main replay button
                replayMain: this.options.replayMain,
                replayMainRollover: this.options.replayMainRollover || this.options.replayMain,

                // sub play button
                playSub: this.options.playSub,

                // sub replay button
                replaySub: this.options.replaySub,
            },
        };
    },
    mounted() {
        const self = this;
        this.video = this.$refs.video;
    },
    methods: {
        // check in function
        checkInHandler() {
            this.resetHandler();

            // to auto play
            // setTimeout(this.videoClickHandler, 500);

            const self = this;

            new PictureLoader({
                sourceQueue: ['image/1.jpg'],
            }).load({
                end: () => {
                    self.is_poster_loaded = true;
                },
            });
        },

        // reset the video state before next show
        resetHandler() {
            this.video.currentTime = 0;
            this.progress = '0%';
            this.is_video_play = false;
        },

        // check if video is finished
        checkVideoFinished() {
            if (this.video.ended) {
                this.showReplay = true;
                this.is_video_play = false;
                this.cancelRequest();
            } else {
                this.showReplay = false;
            }
        },

        // when click the buttons or video itself
        videoClickHandler() {
            if (this.video.paused) {
                this.video.play();
                setTimeout(() => {
                    this.startRequest();
                }, 100);
                this.is_video_play = true;
            } else {
                this.videoPauseHandler();
            }
        },

        // video play to pause action
        videoPauseHandler() {
            this.video.pause();
            this.cancelRequest();
            this.is_video_play = false;
        },

        // when close button clicked
        videoCloseHandler() {
            this.video.pause();
            this.is_video_play = false;
            this.is_video_played = false;
            this.is_poster_loaded = false;
            this.is_video_BFF = true;
        },

        // when video is playing
        timeupdateHandler(e) {
            this.checkVideoFinished();
            this.progress = floatToPercent(e.target.currentTime / e.target.duration);
        },

        // when progress bar is clicked
        barClickHandler(e) {
            const rate = e.offsetX / e.target.clientWidth;
            this.progress = floatToPercent(rate);
            this.video.currentTime = this.video.duration * rate;
            this.checkVideoFinished();
        },

        // the request function is to check if the video is buffering, timeupdate is too slow
        // startRequest
        startRequest() {
            let lastTime = -1;

            const self = this;

            function ifVideoBuffered() {
                self.is_video_buffering = lastTime === self.video.currentTime;
                lastTime = self.video.currentTime;
                self.is_video_BFF = self.video.currentTime === 0;

                if (self.video.currentTime !== 0) {
                    self.is_video_played = true;
                }

                let delayTime = 0;

                if (Platform.isFirefox) {
                    delayTime = 40;
                }

                if (Platform.isAndroid) {
                    delayTime = 1000;
                }

                setTimeout(() => {
                    self.requestId = requestAnimationFrame(ifVideoBuffered);
                }, delayTime);
            }

            ifVideoBuffered();
        },

        // cancelRequest
        cancelRequest() {
            cancelAnimationFrame(this.requestId);
        },
    },
    props: ['options'],
    components: {
        VueLoading,
    },
};
</script>

<style lang="scss" scoped>
    .vue-video {
        position: relative;
        width: 100%;
        cursor: pointer;

        .fade-enter-active {
            transition: opacity 0.4s
        }

        .fade-leave-active {
            transition: opacity 0.6s
        }

        .fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
            opacity: 0
        }

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
                height: 100%;
                left: 0;
                top: 0;
            }

            .video-poster {
                background-color: black;

                img {
                    position: absolute;
                    width: 50%;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                }
            }

            .video-main-controller {
                .rollover-container {
                    position: absolute;
                    display: inline-block;
                    width: 60px;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);

                    // fix ie height issue
                    img {
                        height: auto !important;
                    }

                    .hover {
                        position: absolute;
                        width: 100%;
                        left: 0;
                        top: 0;
                        opacity: 0;
                        visibility: hidden;
                        transition: all ease 0.5s;
                    }

                    .normal {
                        position: relative;
                        opacity: 1;
                        visibility: visible;
                        transition: all ease 0.3s;
                    }
                }

                .desktop &:hover .rollover-container {
                    .hover {
                        opacity: 1;
                        visibility: visible;
                        transition: all ease 0.3s;
                    }

                    .normal {
                        opacity: 0;
                        visibility: hidden;
                        transition: all ease 0.5s;
                    }
                }
            }
        }

        .video-sub-controller {
            position: absolute;
            width: 100%;
            left: 50%;
            transform: translateX(-50%);
            top: 100%;
            z-index: 2;
            height: 50px;

            .button-container {
                position: absolute;
                width: 50px;
                height: 50px;
                left: 0;
                top: 0;

                .button {
                    position: absolute;
                    left: 0px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 20px;
                    height: 20px;
                    cursor: pointer;
                }
            }

            .progress-bar {
                position: relative;
                margin-left: 50px;
                height: 50px;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                cursor: pointer;
            }

            .seek-bar {
                width: 100%;
                height: 3px;
                background-color: #48391b;

                .play-bar{
                    height: 100%;
                    background-color: #d5a83d;
                }
            }
        }
    }
</style>
