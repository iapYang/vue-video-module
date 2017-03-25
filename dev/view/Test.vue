<template lang="html">
    <div class="test-container">
        <top></top>
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
            <div class="video-container">
                <vue-video :options="videoOptions" ref="video"></vue-video>    
            </div>
        </div>
    </div>
</template>

<script>
    import VueVideo from '../component/VueVideo.vue';
    import Top from '../component/Top.vue';
    
    export default {
        data() {
            const base = {
                src: 'http://vjs.zencdn.net/v/oceans.mp4',
                poster: 'http://www.freemake.com/blog/wp-content/uploads/2015/06/videojs-logo.jpg',
                loop: false,
                volume: true,
                controlBar: true,
                spinner: 'circles',
                fullscreen: true,
            };

            const defaultVal = {};
            for (const name in base) {
                defaultVal[name] = base[name].toString();
            }

            return {
                defaultVal,
                videoOptions: Object.assign({
                    onPlayToPause(vueVideo) {
                        console.log(vueVideo);
                    },
                }, base),
                selects: [{
                    name: 'src',
                    options: ['http://vjs.zencdn.net/v/oceans.mp4', 'video/1.mp4'],
                }, {
                    name: 'poster',
                    options: ['http://www.freemake.com/blog/wp-content/uploads/2015/06/videojs-logo.jpg', 'image/1.jpg', 'false'],
                }, {
                    name: 'loop',
                    options: ['true', 'false'],
                }, {
                    name: 'volume',
                    options: ['true', 'false'],
                }, {
                    name: 'controlBar',
                    options: ['true', 'false'],
                }, {
                    name: 'fullscreen',
                    options: ['true', 'false'],
                }],
            };
        },
        mounted() {
            this.video = this.$refs.video;
        },
        methods: {
            changeHandler(name, value) {
                console.log(name, value);
                
                let currentValue = value;
                if (value === 'false') currentValue = false;
                if (value === 'true') currentValue = true;
                
                if (!this.video) return;
                if (name === 'src') this.video.pause();
                this.video.videoOptions[name] = currentValue;
            },
        },
        components: {
            VueVideo,
            Top,
        },
    };
</script>

<style lang="scss" scoped>
    $mLenght: 20px;
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
            margin: 0 auto;
        }
    }
</style>
