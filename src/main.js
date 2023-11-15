// import './assets/main.css'
//重置css样式
import 'normalize.css'
import "@/assets/reset.css"

import { createApp } from 'vue'
import App from './App.vue'

// 1. 引入 mitt，是一个函数
import mitt from 'mitt'

//store
import { createPinia } from "pinia"

// 2. 调用 mitt
const Mit = mitt()




const app = createApp(App)


// 3. vue3 挂载全局 API
app.config.globalProperties.$Bus = Mit

app.use(createPinia())
app.mount('#app')
