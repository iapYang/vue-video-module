<template lang="html">
    <transition name="video">
        <div class="vue-video" :class="{fullscreen: isFullscreen, aspect: videoAspect}" ref="vue-video" v-show="videoCanplay || videoAspect">
            <div class="vue-video-wrapper">
                <div class="main-part part" @click="videoClickHandler">
                    <div class="video-placeholder" :style="videoPadding"></div>
                    <video :loop="videoOptions.loop" :src="videoOptions.src" :autoplay="videoOptions.autoPlay" :muted="videoOptions.muted" ref="video" :playsinline="videoOptions.playsinline" @timeupdate="timeupdateHandler" @loadedmetadata="canplayHandler" @webkitendfullscreen="videoPauseHandler" @playing="videoStartPlayingHandler"
                    @ended="videoEndedHandler">
                    </video>
                    <transition name="fade">
                        <div class="video-poster main-component" v-if="videoOptions.poster" v-show="!is_video_played">
                            <transition name="fade">
                                <img :src="videoOptions.poster" v-show="is_poster_loaded" alt="">
                            </transition>
                        </div>
                    </transition>
                    <div class="video-main-controller main-component">
                        <div class="play-container video-main-controller-part" :class="{'rollover-container': isPlayContainer}" v-show="!showReplay && !is_video_play" v-if="!(platform.isiPhone && !videoOptions.playsinline)">
                            <div class="normal" v-if="videoOptions.playMain">
                                <img :src="videoOptions.playMain" alt="">
                            </div>
                            <div class="hover" v-if="videoOptions.playMainRollover">
                                <img :src="videoOptions.playMainRollover" alt="">
                            </div>
                        </div>
                        <div class="replay-container video-main-controller-part" :class="{'rollover-container': isReplayContainer}" v-show="showReplay && !is_video_play" v-if="!(platform.isiPhone && !videoOptions.playsinline)">
                            <div class="normal" v-if="videoOptions.replayMain">
                                <img :src="videoOptions.replayMain" alt="">
                            </div>
                            <div class="hover" v-if="videoOptions.replayMainRollover">
                                <img :src="videoOptions.replayMainRollover" alt="">
                            </div>
                        </div>
                        <div class="video-main-controller-part" v-show="is_video_play && is_video_buffering">
                            <vue-loading v-if="videoOptions.spinner" :spinner="videoOptions.spinner">
                            </vue-loading>
                        </div>
                    </div>
                </div>
                <div class="video-sub-controller" v-if="videoOptions.controlBar" @click.stop>
                    <div class="button-container play-button" @click="videoClickHandler">
                        <div class="button play" v-show="!showReplay && !is_video_play">
                            <img :src="videoOptions.playSub" alt="">
                        </div>
                        <div class="button pause" v-show="!showReplay && is_video_play">
                            <img :src="videoOptions.pauseSub" alt="">
                        </div>
                        <div class="button preload" v-show="showReplay">
                            <img :src="videoOptions.replaySub" alt="">
                        </div>
                    </div>
                    <div class="progress-bar" @click="barClickHandler">
                        <div class="seek-bar">
                            <div class="play-bar" :style="{width: progress}"></div>
                        </div>
                    </div>
                    <div class="button-container volume-button" :class="volumeClass" @click.stop="volumeClickHandler" v-if="videoOptions.volume && platform.isDesktop">
                        <div class="volume button">
                            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 14.7 14.7" style="enable-background:new 0 0 14.7 14.7;" xml:space="preserve">
                            <polygon id="XMLID_1_" class="st0" points="7.6,1.3 7.6,13.4 4.3,10.5 4.3,4.3 "/>
                            <rect id="XMLID_2_" x="0" y="4.3" class="st0" width="4.5" height="6.2"/>
                            <path id="XMLID_4_" class="st1" d="M8.2,4.2c0,0,2.2,1.2,2.2,3.1s-2.2,3.1-2.2,3.1"/>
                            <path id="XMLID_5_" class="st1" d="M10.2,3c0,0,3,1.7,3,4.3s-3,4.3-3,4.3"/>
                            <line id="XMLID_138_" class="st1" x1="0.3" y1="0.4" x2="14.3" y2="14.4"/>
                            </svg>
                            <div class="volume-progress" @click.stop>
                                <volume-bar ref="volume" v-if="!videoOptions.muted" @volumechange="volumechangeHandler">
                                </volume-bar>
                            </div>
                        </div>
                    </div>
                    <div class="screen-button button-container" v-if="videoOptions.fullscreen" @click="fullscreenClickHandler">
                        <div class="button full">
                            <img :src="videoOptions.fullscreenSub" alt="">
                        </div>
                        <div class="button shrink">
                            <img :src="videoOptions.shrinkscreenSub" alt="">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    import Platform from '../../script/plugin/platform.js';
    import VolumeBar from './VueVideo/VolumeBar.vue';
    
    import VueLoading from 'vue-simple-loading';
    import enableInlineVideo from 'iphone-inline-video';
    
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
                // Platform
                platform: Platform,
    
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
    
                // if the mobile rotate
                isRotate: false,
    
                // if the video is buffering
                is_video_buffering: false,
    
                // requestAnimation id
                requestId: 0,
    
                // if the video is buffering at the first frame
                is_video_BFF: true,
    
                // check if is fullscreen
                isFullscreen: false,
    
                // video
                video: false,
    
                // check if the current video is ready for play
                videoCanplay: false,
    
                // Volume temp
                volumeTemp: 1,
    
                // volume className
                volumeClass: this.options.muted ? 'sound-mute' : 'sound-normal',
    
                // video options
                videoOptions: Object.assign({
                    // source of video (required)
                    // src: this.options.src,
    
                    // poster
                    poster: false,
    
                    // main play button
                    playMain: require('../../image/ignore/play_op2.png'),
                    playMainRollover: require('../../image/ignore/play_rollover_op2.png'),
    
                    // main replay button
                    replayMain: require('../../image/ignore/replay_op2.png'),
                    replayMainRollover: require('../../image/ignore/replay_rollover_op2.png'),
    
                    // sub control button
                    playSub: require('../../image/ignore/play.png'),
                    pauseSub: require('../../image/ignore/pause.png'),
                    replaySub: require('../../image/ignore/replay.png'),
                    fullscreenSub: require('../../image/ignore/screen.svg'),
                    shrinkscreenSub: require('../../image/ignore/screen_shrink.svg'),
    
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
    
                    // play inline on isiPhone
                    playsinline: true,
    
                    // volumes
                    volume: true,
                }, this.options),
            };
        },
        mounted() {
            this.video = this.$refs.video;
            this.volume = this.$refs.volume;
            this.fullscreenElement = Platform.isDesktop ? this.$refs['vue-video'] : this.video;
    
            // first time load poster
            this.posterLoadHandler();

            // is_video_play = if show the play button
            // in case it'll shown and disappear when auto play
            this.is_video_play = this.videoOptions.autoPlay;
    
            // register events when screen came to whole screen
            const fullscreenEvents = [
                'fullscreenchange',
                'webkitfullscreenchange',
                'mozfullscreenchange',
                'msfullscreenchange',
                'MSFullscreenChange',
            ];
    
            fullscreenEvents.forEach(fullscreenEvent => {
                document.addEventListener(fullscreenEvent, () => {
                    this.checkIsFullscreen();
                });
            });
    
            // enable inline play
            enableInlineVideo(this.video);
        },
        computed: {
            isPlayContainer() {
                return this.videoOptions.playMain && this.videoOptions.playMainRollover;
            },
            isReplayContainer() {
                return this.videoOptions.replayMain && this.videoOptions.replayMainRollover;
            },
            videoAspect() {
                if (this.videoOptions.aspect) {
                    const width = this.videoOptions.aspect.width;
                    const height = this.videoOptions.aspect.height;

                    return height / width;
                }

                return false;
            },
            videoPadding() {
                if (!this.videoAspect) {
                    return {
                        'padding-bottom': 0,
                    };
                }

                const padding = floatToPercent(this.videoAspect);

                return {
                    'padding-bottom': padding,
                };
            },
        },
        methods: {
            // if the video is ready for play
            canplayHandler() {
                this.$emit('init', this);
                this.videoCanplay = true;

                setTimeout(() => {
                    this.$refs.volume.reflow();
                }, 100);
    
                // // to auto play
                // if (this.videoOptions.autoPlay) {
                //     setTimeout(this.videoClickHandler, 500);
                // }
            },

            // preload poster
            posterLoadHandler() {
                // after the poster is loaded, it'll show
                const poster = this.videoOptions.poster;
                if (poster && !this.is_poster_loaded) {
                    loadSinglePicture(poster, () => {
                        this.is_poster_loaded = true;
                    });
                }
            },
    
            // when close button clicked
            endPointResetHandler() {
                this.video.currentTime = 0;
                this.progress = '0%';
                this.is_video_play = false;
                this.is_video_played = false;
                this.is_poster_loaded = false;
                this.is_video_BFF = true;
                // this.videoCanplay = false;
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
            },
    
            // video play to pause action
            videoPauseHandler() {
                this.video.pause();
                this.cancelRequest();
                this.$emit('pause', this);
                this.is_video_play = false;
            },
    
            // when video is playing
            timeupdateHandler(e) {
                this.checkVideoFinished();
                this.progress = floatToPercent(e.target.currentTime / e.target.duration);
            },
    
            // Sent when the media begins to play (either for the first time, after having been paused, or after ending and then restarting).
            videoStartPlayingHandler() {
                // in case not cancel the request
                this.cancelRequest();
                setTimeout(() => {
                    this.startRequest();
                }, 100);
                
                this.$emit('play', this);
                
                this.is_video_play = true;
                this.is_video_played = true;
                
                if (this.video.currentTime === 0) {
                    this.$emit('start', this);
                }
            },
    
            // when video is ended
            videoEndedHandler() {
                this.$emit('end', this);
            },
    
            // when progress bar is clicked
            barClickHandler(e) {
                const rate = e.offsetX / e.target.clientWidth;
                this.seek(rate);
            },
    
            // when click the fullscreen button
            fullscreenClickHandler() {
                if (this.isFullscreen) {
                    this.exitFullscreenHandler();
                } else {
                    this.requestFullscreenHandler();
                }
            },
    
            checkIsFullscreen() {
                const fullscreenElement = document.fullscreenElement ||
                    document.webkitFullscreenElement ||
                    document.mozFullScreenElement || document.msFullscreenElement;
                this.isFullscreen = fullscreenElement === this.fullscreenElement;
            },
    
            // into fullscreen
            requestFullscreenHandler() {
                if (this.fullscreenElement.requestFullscreen) {
                    this.fullscreenElement.requestFullscreen();
                } else if (this.fullscreenElement.mozRequestFullScreen) {
                    this.fullscreenElement.mozRequestFullScreen();
                } else if (this.fullscreenElement.webkitRequestFullscreen) {
                    this.fullscreenElement.webkitRequestFullscreen();
                } else if (this.fullscreenElement.msRequestFullscreen) {
                    this.fullscreenElement.msRequestFullscreen();
                } else if (this.fullscreenElement.webkitEnterFullscreen) {
                    this.fullscreenElement.webkitEnterFullscreen();
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
                    document.msExitFullscreen();
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
    
            // volume mute change
            volumeClickHandler() {
                if (this.videoOptions.muted) return;
    
                if (this.video.volume) {
                    // case when volume is not 0
                    this.volumeTemp = this.video.volume;
                    this.volumechangeHandler(1);
                    this.volume.muteHandler(1);
                } else {
                    if (!this.volumeTemp) this.volumeTemp = 0.1;
                    this.volumechangeHandler(1 - this.volumeTemp);
                    this.volume.muteHandler(1 - this.volumeTemp);
                }
            },
    
            // to make the volume change
            // top y = 0, bottom y = 1
            volumechangeHandler(y) {
                if (!this.video) return;
                this.video.volume = 1 - y;
                this.volumeClassHandler();
            },
    
            // set class
            volumeClassHandler() {
                if (this.video.volume >= 0.5) {
                    this.volumeClass = 'sound-normal';
                } else if (this.video.volume === 0) {
                    this.volumeClass = 'sound-mute';
                } else {
                    this.volumeClass = 'sound-low';
                }
            },

            // API
            // video play API
            play() {
                if (this.is_video_play) return;
                this.videoPlayHandler();
            },

            // video pause API
            pause() {
                if (!this.is_video_play) return;
                this.videoPauseHandler();
            },

            // video seek API
            seek(rate) {
                this.progress = floatToPercent(rate);
                this.video.currentTime = this.video.duration * rate;
                this.checkVideoFinished();
            },

            // video replay API
            replay() {
                this.seek(0);
                this.play();
            },

            // change API
            change(options) {
                this.videoOptions = Object.assign({}, this.videoOptions, options);
            },

            // reset
            reset() {
                this.endPointResetHandler();
            },

            // load poster
            loadPoster() {
                this.posterLoadHandler();
            },
        },
        props: ['options'],
        components: {
            VueLoading,
            VolumeBar,
        },
        watch: {
            options(newVal, oldVal) {
                this.videoOptions = Object.assign(
                    {}, this.videoOptions, newVal
                );
            },
        },
    };
</script>

<style lang="scss" scoped>
    @import "../../style/_reset";
    $dashoffset: 100;
    .IIV::-webkit-media-controls-play-button,
    .IIV::-webkit-media-controls-start-playback-button {
        opacity: 0;
        pointer-events: none;
        width: 5px;
    }
    @keyframes ani-go {
        to {
            stroke-dashoffset: 0;
        }
    }
    @keyframes ani-back {
        to {
            stroke-dashoffset: $dashoffset;
        }
    }
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
    .vue-video {
        position: relative;
        width: 100%;
        cursor: pointer;
        .fade-enter-active {
            transition: opacity 0.4s;
        }
        .fade-leave-active {
            transition: opacity 0.6s;
        }
        /* .fade-leave-active in <2.1.8 */
        .fade-enter,
        .fade-leave-to {
            opacity: 0;
        }
        img {
            position: relative;
            display: block;
            width: 100%;
        }
        .vue-video-wrapper {
            position: relative;
            width: 100%;
        }
        .main-part {
            position: relative;
            width: 100%;
            .video-placeholder {
                display: none;
            }
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
                    width: 100%;
                    height: 100%;
                    left: 0;
                    top: 0;
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
                    .normal,
                    .hover {
                        position: relative;
                        width: 100%;
                        opacity: 1;
                        visibility: visible;
                    }
                }
                .rollover-container {
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
            position: relative;
            width: 100%;
            z-index: 2;
            height: 50px;
            display: -webkit-flex;
            display: -ms-flex;
            display: flex;
            justify-content: space-between;
            .button-container {
                position: relative;
                width: 50px;
                height: 50px;
                flex-grow: 0;
                .button {
                    position: absolute;
                    left: 0;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 20px;
                    height: 20px;
                    cursor: pointer;
                }
            }
            .progress-bar {
                position: relative;
                height: 50px;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                cursor: pointer;
                flex-grow: 1;
            }
            .seek-bar {
                width: 100%;
                height: 3px;
                background-color: #48391b;
                .play-bar {
                    height: 100%;
                    background-color: #d5a83d;
                }
            }
            .screen-button {
                width: 40px;
                .button {
                    left: auto;
                    right: 10px;
                    &.shrink {
                        display: none;
                    }
                    &.full {
                        display: block;
                    }
                }
            }
            .volume-button {
                width: 40px;
                .button {
                    width: 20px;
                    height: auto;
                    left: 65%;
                    transform: translate(-50%, -50%);
                    svg {
                        position: relative;
                        width: 100%;
                        .ie & {
                            height: 15px;
                        }
                        .st0 {
                            fill: #D5A83B;
                        }
                        .st1 {
                            fill: none;
                            stroke: #D5A83B;
                            stroke-miterlimit: 10;
                            transition: opacity ease 0.3s;
                        }
                        #XMLID_138_ {
                            stroke-dasharray: $dashoffset;
                            stroke-dashoffset: 0;
                            animation: ani-back 0.3s linear forwards;
                            .ie &,
                            .edge & {
                                stroke-dashoffset: $dashoffset;
                            }
                        }
                    }
                    .volume-progress {
                        position: absolute;
                        width: 100%;
                        height: 100px;
                        left: 0;
                        bottom: 100%;
                        padding: 2px 0;
                        opacity: 0;
                        transition: all ease 0.3s;
                    }
                }
                &.sound-low .button svg {
                    #XMLID_5_ {
                        stroke: transparent;
                    }
                }
                &.sound-mute .button svg {
                    #XMLID_138_ {
                        stroke-dashoffset: $dashoffset;
                        animation: ani-go 2s linear forwards;
                        .ie & {
                            stroke-dashoffset: 0;
                        }
                    }
                }
                .desktop &:hover .button .volume-progress {
                    opacity: 1;
                    height: 100px;
                }
            }
        }
        &.fullscreen {
            background-color: #000;
            .video-sub-controller {
                position: absolute;
                top: 100%;
                opacity: 0;
                visibility: hidden;
                transition: all ease 0.3s;
                .play-button .button {
                    left: 5px;
                }
                .screen-button .button {
                    &.shrink {
                        display: block;
                    }
                    &.full {
                        display: none;
                    }
                }
            }
            .desktop & .vue-video-wrapper:hover .video-sub-controller {
                opacity: 1;
                visibility: visible;
            }
            .firefox &,
            .ie &,
            .edge & {
                display: -webkit-flex;
                display: -ms-flex;
                display: flex;
                align-items: center;
            }
        }
        &.aspect {
            .main-part {
                .video-placeholder {
                    position: relative;
                    display: block;
                }
                video {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    left: 0;
                    top: 0;
                }
            }
        }
    }
</style>
