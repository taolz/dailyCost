import { defineAsyncComponent } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
// 
const Home = () => import('../views/Home.vue')
const Data = () => import('../views/Data.vue')
const User = () => import('../views/User.vue')
const Login = defineAsyncComponent(() => import('../views/Login.vue'))
const Detail = defineAsyncComponent(() => import('../views/Detail.vue'))
const Account = defineAsyncComponent(() => import('../views/Account.vue'))

const routes = [
  {
    path: '/',
    redirect: '/home'
  }, {
    path: '/home',
    component: Home
  }, {
    path: '/data',
    component: Data
  }, {
    path: '/user',
    component: User
  }, {
    path: '/login',
    component: Login
  }, {
    path: '/detail',
    component: Detail
  }, {
    path: '/account',
    component: Account
  }
]

const router = createRouter({
  history: createWebHashHistory(), // hash模式
  routes
})
export default router