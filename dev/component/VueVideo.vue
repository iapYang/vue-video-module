<template lang="html">
    <div class="vue-video">
        <div
         class="main-part part"
         @click="videoClickHandler"
         >
            <div class="video-placeholder"></div>
            <video
             src="video/1.mp4"
             class="main-component"
             ref="video"
             @timeupdate="timeupdateHandler"
             @webkitendfullscreen="videoPauseHandler"
             >
            </video>
            <transition name="fade">
                <div class="video-poster main-component"
                 v-show="if_video_BFF && !if_video_played">
                    <transition name="fade">
                        <img src="image/1.jpg" v-show="if_poster_loaded" alt="">
                    </transition>
                </div>
            </transition>
            <div class="video-main-controller main-component">
                <div
                class="play-container rollover-container"
                v-show="!showReplay && !if_video_play" v-if="!ifIphone">
                    <div class="hover">
                        <img src="image/play_rollover_op2.png" alt="">
                    </div>
                    <div class="normal">
                        <img src="image/play_op2.png" alt="">
                    </div>
                </div>
                <div
                class="replay-container rollover-container"
                v-show="showReplay && !if_video_play" v-if="!ifIphone">
                    <div class="hover">
                        <img src="image/replay_rollover_op2.png" alt="">
                    </div>
                    <div class="normal">
                        <img src="image/replay_op2.png" alt="">
                    </div>
                </div>
                <div
                 class="video-loading rollover-container"
                 v-show="if_video_play && if_video_buffering"
                 v-if="false"
                 >
                    <img src="image/video-loading.gif" alt="">
                </div>
                <div
                 class="video-loading rollover-container vue-loading-container"
                 v-show="if_video_play && if_video_buffering"
                 >
                    <vue-loading spinner="circles"></vue-loading>
                </div>
            </div>
        </div>
        <div class="part video-sub-controller">
            <div class="button-container" @click="videoClickHandler">
                <div
                 class="button preload play"
                 v-show="!showReplay && !if_video_play"
                 >
                     <img src="image/play.png" alt="">
                 </div>
                <div
                 class="button preload pause"
                 v-show="!showReplay && if_video_play"
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

import VueLoading from 'vue-simple-loading';

function floatToPercent(number) {
    return `$(number.toFixed(4) * 100)%`;
}

export default {
    data() {
        return {
            // if video played to control first frame
            if_video_played: false,

            // if the video is playing
            if_video_play: false,

            // should show the replay btn
            showReplay: false,

            // if the poster of loaded
            if_poster_loaded: false,

            // control bar progress
            progress: '0%',

            // check the platform if mobile
            ifMobile: Platform.isMobile,

            // if the mobile rotate
            ifRotate: false,

            // if platform is iphone
            ifIphone: Platform.isiPhone,

            // if the video is buffering
            if_video_buffering: false,

            // requestAnimation id
            requestId: 0,

            // if the video is buffering at the first frame
            if_video_BFF: true,
        };
    },
    mounted() {
        const self = this;
        this.video = this.$refs.video;
    },
    methods: {
        // reset the video state before next show
        resetHandler() {
            this.video.currentTime = 0;
            this.progress = '0%';
            this.ifRotate = false;
            this.if_video_play = true;
        },

        // check if video is finished
        checkVideoFinished() {
            if (this.video.ended) {
                this.showReplay = true;
                this.if_video_play = false;
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
                this.if_video_play = true;
            } else {
                this.videoPauseHandler();
            }
        },

        // video play to pause action
        videoPauseHandler() {
            this.video.pause();
            this.cancelRequest();
            this.if_video_play = false;
        },

        // when close button clicked
        videoCloseHandler() {
            this.video.pause();
            this.if_video_play = false;
            this.if_video_played = false;
            this.if_poster_loaded = false;
            this.if_video_BFF = true;
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
                self.if_video_buffering = lastTime === self.video.currentTime;
                lastTime = self.video.currentTime;
                self.if_video_BFF = self.video.currentTime === 0;

                if (self.video.currentTime !== 0) {
                    self.if_video_played = true;
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
            height: 100px;

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
