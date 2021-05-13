<template>
  <router-view />
  <Tabbar v-if="show" />
</template>

<script>
import Tabbar from './components/Tabbar.vue';
import { useRouter } from 'vue-router';
import { reactive, toRefs } from 'vue';
export default {
  name: 'App',
  components: {
    Tabbar,
  },
  setup () {
    const state = reactive({
      menu: ['/home', '/data', '/user'],
      show: false
    })
    const router = useRouter()
    router.afterEach(() => {
      console.log(router);
      state.show = state.menu.includes(router.currentRoute._value.path)
    })

    return {
      ...toRefs(state)
    }
  }
}
</script>
