

# vue-video-module

A simple video component built for vue.

Work fine on IE 11+, Chrome, firefox, ipad and it's mobile friendly.

### Example

[Demo Page](https://iapyang.github.io/vue-video-module/)

#### or 

```javascript
// step 1
npm install
// step 2
npm run dev
// preview link http://0.0.0.0:8080/#/test
// code is in dev/component/Test.vue
```

### Usage

#### Install vue-video-module

`npm install vue-video-module -D`

#### Vue use

```javascript
import Vue from 'vue'
import VueVideo from 'vue-video-module'

// use
export default {
  components: {
    VueVideo,
  },
};
```

#### Use in component

```vue
<div class="video-container">
  <vue-video ref="video1" :options="videoOptions"></vue-video>
</div>
```

```javascript
// e.g
videoOptions: {
  src: 'http://vjs.zencdn.net/v/oceans.mp4',
  poster: 'http://www.freemake.com/blog/wp-content/uploads/2015/06/videojs-logo.jpg',
  controlBar: true,
  spinner: 'circles',
  fullscreen: true,
},
```

### API

#### Props

Below are properties you can use in videoOptions to construct your own video.

If the value is false means this part will not be rendered.

| Name               | Description                              | Value             | Default   |
| ------------------ | ---------------------------------------- | ----------------- | --------- |
| src                | the source of video                      | string (required) | null      |
| poster             | the poster of the video                  | string \|\| false | false     |
| playMain           | the source of main play button           | string \|\| false | base64    |
| playMainRollover   | the source of main play button rollover state | string \|\| false | base64    |
| replayMain         | the source of main replay button         | string \|\| false | base64    |
| replayMainRollover | the source of main replay button rollover state | string \|\| false | base64    |
| playSub            | the source of play button in the video control bar | string            | base64    |
| pauseSub           | the source of pause button in the video control bar | string            | base64    |
| replaySub          | the source of replay button in the video control bar | string            | base64    |
| fullscreen         | if fullscreen part shown                 | bool              | true      |
| fullscreenSub      | the source of full screen button in the video control bar | string \|\| false | base64    |
| shrinkscreenSub    | the source to shrink screen to normal size, button in the video control bar | string            | base64    |
| loop               | loop video                               | bool              | false     |
| muted              | muted video                              | bool              | false     |
| controlBar         | if show the controlbar                   | bool              | true      |
| spinner            | the loading style, check [here](https://github.com/iapYang/vue-simple-loading) | string            | 'circles' |
| volume             | show the volume controller               | bool              | true      |
#### Callback

##### brief：

the vueVideo is the object of this component

vueVideo.$refs.video is the dom of the video

| Name                    | Description                            | Type     |
| ----------------------- | -------------------------------------- | -------- |
| onInit(vueVideo)        | be called after the video is initialed | function |
| onPauseToPlay(vueVideo) | video status from pause to play        | function |
| onPlayToPause(vueVideo) | video status from play to pause        | function |
| onStart(vueVideo)       | video start                            | function |
| onEnded(vueVideo)       | video end                              | function |
