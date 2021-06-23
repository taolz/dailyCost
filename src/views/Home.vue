<template>
  <div class="home">
    <div class="header">
      <div class="type-wrap" @click="toggle">
        <span class="title">{{ currentSelect.name || '全部类型' }}</span>
        <i class="iconfont leixing" />
      </div>
      <div class="data-wrap">
        <span class="time" @click="monthToggle">
          {{ currentTime }}
          <i class="iconfont sort-down" />
        </span>
        <span class="expense">总支出 ¥{{ totalExpense }}</span>
        <span class="income">总收入 ¥{{ totalIncome }}</span>
      </div>
    </div>
    <div class="content-wrap">
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
        >
          <CardItem v-for="item in list" :bill="item" :key="item" />
        </van-list>
      </van-pull-refresh>
    </div>
    <div class="add" @click="addToggle">
      <van-icon name="records" />
    </div>
    <PopType ref="popRef" @select="select" />
    <PopMonth ref="popMonthRef" @select="selectMonth" />
    <PopAdd ref="popAddRef" @refresh="onRefresh" />
  </div>
</template>

<script>
import { reactive, ref, toRefs } from 'vue'
import CardItem from '../components/CardItem.vue'
import PopType from '../components/PopType.vue'
import PopMonth from '../components/PopMonth.vue'
import PopAdd from '../components/PopAdd.vue'
import axios from '../utils/axios'
import dayjs from 'dayjs'

export default {
  components: {
    CardItem,
    PopType,
    PopMonth,
    PopAdd
  },
  setup () {
    const popRef = ref(null)
    const popMonthRef = ref(null)
    const popAddRef = ref(null)

    const state = reactive({
      totalExpense: 0, // 总支出
      totalIncome: 0, // 总收入
      totalPage: 0, // 账单总页
      list: [], // 总账单
      page: 1, // 分页
      loading: false, // 是否处于加载中状态,底部list load事件
      finished: false, // 是否全部加载完毕，
      refreshing: false, // 下拉刷新
      currentSelect: {}, // 当前选择的
      currentTime: dayjs().format('YYYY-MM') // 默认当前年月
    })
    // 拉取数据
    const getBillList = async () => {
      const { data } = await axios.get('/bill/list', {
        params: {
          date: state.currentTime,
          type_id: state.currentSelect.id,
          page: state.page,
          page_size: 5
        }
      })
      // 下拉刷新状态时
      if (state.refreshing) {
        state.list = []
        state.refreshing = false
      }
      state.loading = false

      state.list = state.list.concat(data.list)
      state.totalExpense = data.totalExpense.toFixed(2)
      state.totalIncome = data.totalIncome.toFixed(2)
      state.totalPage = data.totalPage
      if (state.page >= state.totalPage) state.finished = true
    }
    // 上拉加载
    const onLoad = () => {
      // 不下拉刷新且当前页面小于总页
      if (!state.refreshing && state.page < state.totalPage) {
        state.page = state.page + 1
      }
      getBillList()
    }
    // 下拉刷新
    const onRefresh = () => {
      // list 的 load事件
      // 清空列表数据
      state.finished = false
      // 页数重制
      state.page = 1
      state.refreshing = true
      state.loading = true
      onLoad()
    }
    // popType;打开类型弹窗
    const toggle = () => {
      popRef.value.toggle()
    }
    // 在 popType 选择的
    const select = (item) => {
      state.currentSelect = item
      onRefresh()
    }
    // PopMonth;打开日期弹窗
    const monthToggle = () => {
      popMonthRef.value.toggle()
    }
    // 在 popMonth 选择的
    const selectMonth = (item) => {
      state.currentTime = item
      onRefresh()
    }

    // 添加账单
    const addToggle = () => {
      popAddRef.value.toggle()
    }

    return {
      ...toRefs(state),
      popRef,
      popMonthRef,
      popAddRef,
      toggle,
      monthToggle,
      addToggle,
      onLoad,
      onRefresh,
      select,
      selectMonth
    }
  }
}
</script>

<style lang='less' scoped>
@import url('../config/custom.less');

.home {
  height: 100%;
  padding-top: 80px;
  .header {
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 80px;
    padding: 20px;
    background-color: @primary;
    color: #fff;
    font-size: 14px;
    .type-wrap {
      position: relative;
      align-self: baseline;
      display: inline-block;
      padding: 6px;
      border-radius: 4px;
      background-color: #50ca84;
      .title {
        margin-right: 22px;
        &::after {
          content: '';
          position: absolute;
          top: 12px;
          bottom: 11px;
          right: 32px;
          width: 1px;
          background-color: #e9e9e9;
        }
      }
    }
    .data-wrap {
      margin-top: 10px;
      font-size: 13px;
      .time {
        margin-right: 12px;
        .sort-down {
          font-size: 12px;
        }
      }
      .expense {
        margin-right: 10px;
      }
    }
  }
  .content-wrap {
    height: calc(~'(100% - 50px)');
    overflow: hidden;
    overflow-y: scroll;
    background-color: #f5f5f5;
    padding: 10px;
  }

  .add {
    position: fixed;
    bottom: 100px;
    right: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid #e9e9e9;
    font-size: 20px;
    background-color: #fff;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    color: @primary;
  }
}
</style>