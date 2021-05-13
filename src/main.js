import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "lib-flexible/flexible";
import { Button } from "vant"
import 'vant/lib/index.css';
import './index.css'

const app = createApp(App)
app.use(Button);
app.use(router)

app.mount('#app')
