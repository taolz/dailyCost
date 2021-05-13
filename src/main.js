import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "lib-flexible/flexible";
import { Tabbar, TabbarItem, NavBar } from "vant"
import 'vant/lib/index.css';
import './index.css'

const app = createApp(App)

app.use(Tabbar);
app.use(TabbarItem);
app.use(NavBar);
app.use(router)

app.mount('#app')
