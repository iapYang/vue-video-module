import Vue from 'vue';
import VueRouter from 'vue-router';
import Main from './component/view/Main.vue';
import Test from './component/view/Test.vue';
import Pure from './component/view/Pure.vue';

Vue.use(VueRouter);

const routes = [{
    path: '',
    name: 'main',
    component: Main,
}, {
    path: '/test',
    name: 'test',
    component: Test,
}, {
    path: '/pure',
    name: 'pure',
    component: Pure,
}];

const router = new VueRouter({routes});

export default router;
