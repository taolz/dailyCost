import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../view/Home.vue';
import Data from '../view/Data.vue';
import User from '../view/User.vue';
import Login from '../view/Login.vue';

const routes = [
  {
    path: "/",
    redirect: "/home"
  },
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/data',
    name: 'data',
    component: Data
  },
  {
    path: '/user',
    name: 'user',
    component: User
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
]

const router = createRouter({
  history: createWebHashHistory(), // hash模式
  routes
})
export default router