<template lang="html">
    <div class="test-container">
        <top :showButton="true"></top>
        <h2>Video came from The Lorax Forces of Nature</h2>
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
    import VueVideo from '../src/VueVideo.vue';
    import Top from '../common/Top.vue';
    
    export default {
        data() {
            const selects = [{
                name: 'src',
                options: [
                    'video/1.mp4',
                    'http://vjs.zencdn.net/v/oceans.mp4',
                ],
            }, {
                name: 'poster',
                options: [
                    'image/1.jpg',
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

            return {
                defaultVal,
                videoOptions: Object.assign({
                    onPlayToPause(vueVideo) {
                        console.log(vueVideo);
                    },
                }, videoOptions),
                selects,
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
            max-width: 1200px;
            margin: 0 auto;
        }
    }
</style>
