import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { vScrollReveal } from './directives/vScrollReveal';
import './assets/main.css';

const app = createApp(App);
app.use(router);
app.directive('scroll-reveal', vScrollReveal);
app.mount('#app');
