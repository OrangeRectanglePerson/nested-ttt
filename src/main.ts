import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createPinia } from "pinia";
import vSelect from 'vue-select';
import {globalPiniaInstance} from "./global";

createApp(App)
    .use(globalPiniaInstance)
    .component('v-select', vSelect)
    .mount('#app')
