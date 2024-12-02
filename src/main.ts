import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

//引入Element-Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
import axios from 'axios'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')

axios.defaults.headers.post['Content-Type'] = 'application/json';