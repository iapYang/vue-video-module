<template lang="html">
    <div class="test-container">
        <top :showButton="true"></top>
        <h2>Video came from Youtube. Maybe you have to wait for a while.</h2>
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
            const selects = [{
                name: 'src',
                options: [
                    'https://redirector.googlevideo.com/videoplayback?lmt=1471566762181218&sparams=dur%2Cei%2Cgcr%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Cratebypass%2Crequiressl%2Csource%2Cupn%2Cexpire&ei=IjnWWJO0PNS5-APvgpOIDg&dur=544.577&signature=CE8B51D5558380FB78A40851449392CABCDBBA24.270EAFA75683352C622B73B62609C942E54C8412&initcwndbps=5095000&ipbits=0&ratebypass=yes&upn=vam_c1LfTIo&key=yt6&itag=22&mn=sn-n4v7sn7l&pl=33&source=youtube&mm=31&requiressl=yes&ip=2600%3A3c01%3A%3Af03c%3A91ff%3Afe24%3Ab564&mime=video%2Fmp4&expire=1490455939&mt=1490434226&ms=au&id=o-ADTYoua3b4FZWSdj0lFrJ598SO3-gMYlTnJn5aZeMph0&mv=m&gcr=us',
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
            margin: 0 auto;
        }
    }
</style>
