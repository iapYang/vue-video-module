<template lang="html">
    <div
     class="vue-video"
     :class="{screen: videoOptions.fullscreen, fullscreen: checkIsFullscreen()}"
     >
        <div
         class="main-part part"
         @click="videoClickHandler"
         >
            <video
             :loop="videoOptions.loop"
             :src="videoOptions.src"
             :muted="videoOptions.muted"
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
                 class="play-container video-main-controller-part"
                 :class="{'rollover-container': videoOptions.playMain && videoOptions.playMainRollover}"
                 v-show="!showReplay && !is_video_play"
                 v-if="!isiPhone && videoOptions.playMain"
                 >
                    <div class="normal">
                        <img :src="videoOptions.playMain" alt="">
                    </div>
                    <div class="hover">
                        <img :src="videoOptions.playMainRollover" alt="">
                    </div>
                </div>
                <div
                 class="replay-container video-main-controller-part"
                 :class="{'rollover-container': videoOptions.replayMain && videoOptions.replayMainRollover}"
                 v-show="showReplay && !is_video_play"
                 v-if="!isiPhone && videoOptions.replayMain"
                 >
                    <div class="normal">
                        <img :src="videoOptions.replayMain" alt="">
                    </div>
                    <div class="hover">
                        <img :src="videoOptions.replayMainRollover" alt="">
                    </div>
                </div>
                <div
                 class="video-main-controller-part"
                 v-show="is_video_play && is_video_buffering"
                 >
                    <vue-loading
                     v-if="videoOptions.spinner"
                     :spinner="videoOptions.spinner"></vue-loading>
                </div>
            </div>
        </div>
        <div class="part video-sub-controller" v-if="videoOptions.controlBar">
            <div class="button-container" @click="videoClickHandler">
                <div
                 class="button play"
                 v-show="!showReplay && !is_video_play"
                 >
                     <img :src="videoOptions.playSub" alt="">
                </div>
                <div
                 class="button pause"
                 v-show="!showReplay && is_video_play"
                 >
                     <img :src="videoOptions.pauseSub" alt="">
                </div>
                <div
                 class="button preload"
                 v-show="showReplay"
                 >
                     <img :src="videoOptions.replaySub" alt="">
                </div>
            </div>
            <div class="progress-bar" @click="barClickHandler">
                <div class="seek-bar">
                    <div class="play-bar" :style="{width: progress}"></div>
                </div>
            </div>
            <div
             class="screen-button button-container"
             @click="fullscreenClickHandler"
             >
                <div
                 class="button"
                 >
                     <img :src="videoOptions.fullscreenSub" alt="">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CONFIG from '../data/config.json';

import Platform from '../script/plugin/platform.js';

import VueLoading from 'vue-simple-loading';

function floatToPercent(number) {
    return `${number.toFixed(4) * 100}%`;
}

function loadSinglePicture(src, cb) {
    const downloadingImage = new Image();
    downloadingImage.onload = () => {
        cb();
    };
    downloadingImage.src = src;
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
            isMobile: Platform.isMobile,

            // if the mobile rotate
            isRotate: false,

            // if platform is iphone
            isiPhone: Platform.isiPhone,

            // if the video is buffering
            is_video_buffering: false,

            // requestAnimation id
            requestId: 0,

            // if the video is buffering at the first frame
            is_video_BFF: true,

            // the whole document
            document,

            // video
            video: false,

            // video options
            videoOptions: Object.assign({
                // source of video (required)
                // src: this.options.src,

                // poster
                poster: false,

                // main play button
                playMain: false,
                playMainRollover: false,

                // main replay button
                replayMain: false,
                replayMainRollover: false,

                // sub control button
                playSub: CONFIG.play,
                pauseSub: CONFIG.pause,
                replaySub: CONFIG.replay,
                fullscreenSub: CONFIG.fullscreen,

                // if the video loop
                loop: false,

                // if the video muted
                muted: false,

                // autoPlay
                autoPlay: false,

                // control bar
                controlBar: true,

                // loading
                spinner: 'circles',

                // fullscreen
                fullscreen: false,

                // checkIn cb
                checkInCb() {},

                // checkOut cb
                checkOutCb() {},
            }, this.options),
        };
    },
    mounted() {
        this.video = this.$refs.video;

        this.checkInHandler();

        this.$on('video:checkIn', () => {
            this.checkInHandler();
        });
    },
    methods: {
        // check in function
        checkInHandler() {
            this.startPointResetHandler();

            // to auto play
            if (this.videoOptions.autoPlay) {
                setTimeout(this.videoClickHandler, 500);
            }

            const self = this;

            // after the poster is loaded, it'll show
            const poster = this.videoOptions.poster;
            if (poster) {
                loadSinglePicture(poster, () => {
                    self.is_poster_loaded = true;
                });
            }

            // user choice when video is checkedIn
            this.videoOptions.checkInCb(this.video);
        },

        // reset the video state before next show
        startPointResetHandler() {
            this.video.currentTime = 0;
            this.progress = '0%';
            this.is_video_play = this.videoOptions.autoPlay;
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
                this.videoPlayHandler();
            } else {
                this.videoPauseHandler();
            }
        },

        // video pause to play action
        videoPlayHandler() {
            this.video.play();
            setTimeout(() => {
                this.startRequest();
            }, 100);
            this.is_video_play = true;
        },

        // video play to pause action
        videoPauseHandler() {
            this.video.pause();
            this.cancelRequest();
            this.is_video_play = false;
        },

        // check
        checkOutHandler() {
            this.endPointResetHandler();
            this.videoOptions.checkOutCb(this.video);
        },

        // when close button clicked
        endPointResetHandler() {
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

        // when click the fullscreen button
        fullscreenClickHandler() {
            if (this.checkIsFullscreen()) {
                this.exitFullscreenHandler();
            } else {
                this.requestFullscreenHandler();
            }
        },

        checkIsFullscreen() {
            return document.webkitFullscreenElement === this.video;
        },

        // into fullscreen
        requestFullscreenHandler() {
            if (this.video.requestFullscreen) {
                this.video.requestFullscreen();
            } else if (this.video.mozRequestFullScreen) {
                this.video.mozRequestFullScreen();
            } else if (this.video.webkitRequestFullscreen) {
                this.video.webkitRequestFullscreen();
            } else if (this.video.msRequestFullscreen) {
                this.video.msRequestFullscreen();
            }
        },

        // exit fullscreen
        exitFullscreenHandler() {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen()();
            }
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
    watch: {

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
            video {
                position: relative;
                display: block;
                width: 100%;

                &::-webkit-media-controls {
                    display: none !important;
                }
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
                .video-main-controller-part {
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

            .screen-button {
                display: none;

                .fullscreen & {
                    display: block;
                }
            }
        }

        &.screen .video-sub-controller {
            .progress-bar {
                margin-right: 50px;
            }

            .screen-button {
                position: absolute;
                display: block;
                right: 10px;
                left: auto;

                .button {
                    left: auto;
                    right: 0;
                }
            }
        }

        &.fullscreen .video-sub-controller {
            position: absolute;
            top: auto;
            bottom: 0;
            z-index: 2147483648;
        }
    }
</style>
