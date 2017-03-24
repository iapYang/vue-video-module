

[![GitHub issues](https://img.shields.io/github/issues/iapYang/vue-video-module.svg?style=flat-square)](https://github.com/iapYang/vue-video-module/issues)
[![GitHub forks](https://img.shields.io/github/forks/iapYang/vue-video-module.svg?style=flat-square)](https://github.com/iapYang/vue-video-module/network)
[![GitHub stars](https://img.shields.io/github/stars/iapYang/vue-video-module.svg?style=flat-square)](https://github.com/iapYang/vue-video-module/stargazers)

[![NPM](https://nodei.co/npm/vue-video-module.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/vue-video-module/)

[![NPM](https://nodei.co/npm-dl/vue-video-module.png?months=1&height=2)](https://nodei.co/npm/vue-video-module/)

# vue-video-module

A simple video component built for vue.

Work fine on IE 11+, Chrome, firefox, ipad and it's mobile friendly.

### Changelog

> v0.3.2 add API methods
>
> v0.3.1 fix IE11 fullscreen layout bug

### Example

[Demo Page](https://iapyang.github.io/vue-video-module/)

### Usage

#### Install vue-video-module

`npm install vue-video-module -D`

#### Vue use

```javascript
// import
import Vue from 'vue';
import VueVideo from 'vue-video-module';

// require
var Vue = require('Vue');
var VueVideo = require('vue-video-module');

// mount with component
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
| autoPlay           | if the video auto play                   | bool              | false     |
| loop               | loop video                               | bool              | false     |
| muted              | muted video                              | bool              | false     |
| controlBar         | if show the controlbar                   | bool              | true      |
| spinner            | the loading style, check [here](https://github.com/iapYang/vue-simple-loading) | string            | 'circles' |
| volume             | show the volume controller               | bool              | true      |
#### Callback

##### brief：

the `vueVideo` is the object of this component

`vueVideo.$refs.video` is the dom of the video

| Name                    | Description                            | Type     |
| ----------------------- | -------------------------------------- | -------- |
| onInit(vueVideo)        | be called after the video is initialed | function |
| onPauseToPlay(vueVideo) | video status from pause to play        | function |
| onPlayToPause(vueVideo) | video status from play to pause        | function |
| onStart(vueVideo)       | video start                            | function |
| onEnded(vueVideo)       | video end                              | function |
#### Methods

##### brief：

the `vueVideo` is the object of this component

```javascript
// e.g
vueVideo.play();
```

| Name       | Description                     |
| ---------- | ------------------------------- |
| play()     | make the video play             |
| pause()    | make the video pause            |
| replay()   | make the video replay           |
| seek(rate) | 0 <= rate <= 1, jump to a ponit |

### Todo List

- add options for manually set width and height