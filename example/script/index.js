import 'babel-polyfill';

import Vue from 'vue';

import App from '../component/App.vue';

const app = new Vue({
    components: {
        App,
    },
}).$mount('#app');
