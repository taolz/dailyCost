<template>
  <van-tabbar v-model="active">
    <van-tabbar-item icon="notes-o" name="/home" @click="link('/home')">
      明细
    </van-tabbar-item>
    <van-tabbar-item icon="bar-chart-o" name="/data" @click="link('/data')">
      统计
    </van-tabbar-item>
    <van-tabbar-item icon="user-o" name="/user" @click="link('/user')">
      我的
    </van-tabbar-item>
  </van-tabbar>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
export default {
  name: "Tabbar",
  setup () {
    const router = useRouter()
    const active = ref('/home')

    const link = (path) => {
      router.push({ path })
    }

    onMounted(() => {
      active.value = router.currentRoute.value.path
    })

    router.afterEach(() => {
      active.value = router.currentRoute.value.path;
    })

    return {
      active,
      link
    }
  }
}
</script>

<style lang="less">
@import url('../config/custom.less');
.van-tabbar-item--active {
  color: @primary!important;
}
</style>
