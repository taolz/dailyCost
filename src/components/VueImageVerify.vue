<template>
  <div class="img-verify">
    <canvas
      ref="verify"
      :width="width"
      :height="height"
      @click="handleDraw"
    ></canvas>
  </div>
</template>

<script>
import { reactive, onMounted, ref, toRefs } from 'vue'
export default {
  setup () {
    const verify = ref(null)
    const state = reactive({
      pool: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
      width: 120,
      height: 40,
      imgCode: ''
    })
    onMounted(() => {
      // 初始化绘制图片验证码
      state.imgCode = draw()
    })

    // 点击图片重新绘制
    const handleDraw = () => {
      state.imgCode = draw()
    }

    // 随机数
    const randomNum = (min, max) => {
      return parseInt(Math.random() * (max - min) + min)
    }
    // 随机颜色
    const randomColor = (min, max) => {
      const r = randomNum(min, max)
      const g = randomNum(min, max)
      const b = randomNum(min, max)
      return `rgb(${r},${g},${b})`
    }

    // 绘制图片
    const draw = () => {
      /**
       * 1.获取 canvas 2d渲染上下文(画笔)
       * 2.验证码的框
       * 3.验证码,随机字符串,随机位置大小颜色旋转
       * 4.干扰线
       * 5.干扰点
       */
      const ctx = verify.value.getContext('2d')
      // 验证码范围
      ctx.fillRect(0, 0, state.width, state.height)
      // 填充颜色
      ctx.fillStyle = randomColor(180, 230)
      // 定义paramText
      let imgCode = ''
      // 4.随机产生字符串，并且随机旋转
      for (let i = 0; i < 4; i++) {
        // 随机验证码文本
        const text = state.pool[randomNum(0, state.pool.length)]
        imgCode += text
        // 随机文本大小、对齐、颜色
        const fontSize = randomNum(18, 40)
        // 随机文本变换、旋转角度
        const deg = randomNum(-30, 30)
        ctx.font = fontSize + 'px Simhei'
        ctx.textBaseline = 'top'
        ctx.fillStyle = randomColor(80, 150)
        // 保存快照,变形操作前使用
        ctx.save()
        ctx.translate(30 * i + 15, 15)
        ctx.rotate((deg * Math.PI) / 180)
        // 绘制文本
        ctx.fillText(text, -15 + 5, -15)
        ctx.restore()
      }
      // 5.随机产生5条干扰线,干扰线的颜色要浅一点
      for (let i = 0; i < 5; i++) {
        ctx.beginPath()
        ctx.moveTo(randomNum(0, state.width), randomNum(0, state.height))
        ctx.lineTo(randomNum(0, state.width), randomNum(0, state.height))
        ctx.strokeStyle = randomColor(180, 230)
        ctx.closePath()
        ctx.stroke()
      }
      // 6.随机产生40个干扰的小点
      for (let i = 0; i < 40; i++) {
        ctx.beginPath()
        ctx.arc(randomNum(0, state.width), randomNum(0, state.height), 1, 0, 2 * Math.PI)
        ctx.closePath()
        ctx.fillStyle = randomColor(150, 200)
        ctx.fill()
      }
      return imgCode
    }

    return {
      ...toRefs(state),
      verify,
      handleDraw
    }
  }
}
</script>

<style lang="less" scoped>
.img-verify canvas {
  cursor: pointer;
}
</style>