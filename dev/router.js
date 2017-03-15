import Vue from 'vue';
import VueRouter from 'vue-router';

import Test from './component/Test.vue';

Vue.use(VueRouter);

const routes = [
    {
        path: '/test',
        name: 'test',
        component: Test,
    },
];

const router = new VueRouter({
    routes,
});

export default router;
