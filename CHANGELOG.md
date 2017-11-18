# Changelog

For latest changes in version  please go to [Readme](https://github.com/iapYang/vue-video-module/blob/master/README.md)

# Old Changelog

## v0.4.5

### 💅 Polish

- For umd users, due to webpack2 compile changes. The module export compile way changes, so you have no choice but set `VueVideo = VueVideo.default` at the begining.
- Sorry for the unconvenience.

## v0.4.4 

### 🚀 New Feature

- add timeProgress option, [Usage](https://github.com/iapYang/vue-video-module/blob/master/dev/component/example/06-timeProgress.vue)

## v0.4.3

### 🚀 New Feature

- add buffering bar choice, [Usage](https://github.com/iapYang/vue-video-module/blob/master/dev/component/example/05-bufferingBar.vue)

## v0.4.2

### 🚀 New Feature

- add supprot to cdn, [Usage](https://github.com/iapYang/vue-video-module/blob/master/demo/index.html)

## v0.4.1

### 🚀 New Feature

- add endFrame option

## v0.4.0 

### WARNING! May cause former project failed!

### 💅 Polish

- change former function like `onInit()` to events
- `changeVal(props)` rename to `change(options)`

### 🐛 Bug Fix

- the `reset()`  function will not make the componet `display:none` again

## v0.3.6

### 💅 Polish

- rewrite auto play
- remove onCanplay props, merge onInit and onCanplay into one

### 🚀 New Feature

- add aspect props, see [example4](https://github.com/iapYang/vue-video-module/blob/master/dev/component/example/04-aspect.vue) for more information

## v0.3.5

### 🐛 Bug Fix

- urgent entry js error fix

## v0.3.4

### 🚀 New Feature

- add more props and methods

## v0.3.3

### 💅 Polish

- poster size change

## v0.3.2

### 🚀 New Feature

- add API methods

## v0.3.1

### 🐛 Bug Fix

- fix IE11 fullscreen layout bug