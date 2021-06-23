<template>
  <van-popup v-model:show="show" position="bottom" round>
    <div class="add-wrap">
      <header class="header">
        <span class="close" @click="show = false">
          <van-icon name="cross" />
        </span>
        <van-button
          class="add-btn"
          type="primary"
          size="small"
          @click="addBill"
        >
          确定
        </van-button>
      </header>
      <div class="filter">
        <div class="type">
          <span
            @click="changeType('expense')"
            class="expense"
            :class="{ active: payType === 'expense' }"
          >
            支出
          </span>
          <span
            @click="changeType('income')"
            class="income"
            :class="{ active: payType === 'income' }"
          >
            收入
          </span>
        </div>
        <div class="time" @click="showDay = true">
          {{ $filters.transDay(date) }} <i class="iconfont sort-down" />
        </div>
      </div>
      <div class="money">
        <span class="sufix">¥</span>
        <span class="amount animation">{{ amount }}</span>
      </div>
      <div class="type-warp">
        <div class="type-body" v-if="payType === 'expense'">
          <div
            class="type-item"
            v-for="item in expense"
            :key="item.id"
            @click="choseType(item)"
          >
            <span
              class="iconfont-wrap expense"
              :class="{
                active: currentType.id === item.id
              }"
            >
              <i class="iconfont" :class="typeMap[item.id].icon" />
            </span>
            <span>{{ item.name }}</span>
          </div>
        </div>
        <div class="type-body" v-else>
          <div
            class="type-item"
            v-for="item in income"
            :key="item.id"
            @click="choseType(item)"
          >
            <span
              :class="{
                'iconfont-wrap': true,
                income: true,
                active: currentType.id === item.id
              }"
            >
              <i class="iconfont" :class="typeMap[item.id].icon" />
            </span>
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
      <div class="remark" v-if="remark" @click="remarkVisible = true">
        {{ remark }}
      </div>
      <div class="remark" v-else @click="remarkVisible = true">添加备注</div>
      <van-number-keyboard
        :show="true"
        extra-key="."
        @delete="remove"
        @input="inputChange"
      />
    </div>
    <van-dialog v-model:show="remarkVisible" title="备注" show-cancel-button>
      <van-field
        v-model="remark"
        rows="2"
        autosize
        type="textarea"
        maxlength="20"
        placeholder="请输入备注"
        show-word-limit
      />
    </van-dialog>
    <van-popup
      v-model:show="showDay"
      position="bottom"
      round
      :style="{ height: '46%' }"
    >
      <van-datetime-picker
        v-model="date"
        type="date"
        title="选择时间"
        @confirm="choseDay"
        @cancel="showDay = false"
      />
    </van-popup>
  </van-popup>
</template>

<script>
import { reactive, toRefs, onMounted, ref } from 'vue'
import { typeMap } from '@/utils'
import axios from '../utils/axios'
import { Toast } from 'vant'
import dayjs from 'dayjs'
export default {
  props: {
    refresh: Function,
    detail: {
      type: Object,
      default: {}
    }
  },
  setup (props, ctx) {
    const id = props.detail && props.detail.id // 外部传进来的账单详情 id
    const remarkVisible = ref(false)

    const state = reactive({
      typeMap: typeMap, // 类型key-value键值对
      show: false, // 显示隐藏添加账单弹窗
      amount: id ? props.detail.amount : '', // 账单价格
      payType: id ? (props.detail.pay_type === 1 ? 'expense' : 'income') : 'expense', // 支出或收入类型
      expense: [], // 支出类型数组
      income: [], // 收入类型数组
      currentType: id ? {
        id: props.detail.type_id,
        name: props.detail.type_name
      } : {}, // 当前选择的类型对象
      showDay: false, // 选择日期显示/隐藏
      date: id ? dayjs(Number(props.detail.date)).$d : new Date(), // 日期
      remark: id ? props.detail.remark : '' // 备注
    })

    onMounted(async () => {
      // 消费类型列表
      const { data: { list } } = await axios.get('/type/list')
      state.expense = list.filter(ele => ele.type === '1')
      state.income = list.filter(ele => ele.type === '2')
      // 没有 id 的情况下，说明是新建账单。
      if (!id) {
        state.currentType = state.expense[0]
      }
    })
    // 页面显示与否
    const toggle = () => {
      state.show = !state.show
    }
    // 金额输入框
    const inputChange = (value) => {
      // 有两个.时退出
      if (value === '.' && state.amount.includes('.')) return
      // 超过两位小数退出
      if (value !== '.' && state.amount.includes('.') && state.amount && state.amount.split('.')[1].length >= 2) return
      state.amount += value
    }
    // 删除输入框最后一位
    const remove = () => {
      state.amount = state.amount.slice(0, state.amount.length - 1)
    }
    // 选择具体类型，餐饮..
    const choseType = (item) => {
      state.currentType = item
    }
    // 选择类型收入 or 支出
    const changeType = (type) => {
      state.payType = type
      // 默认收支对应的第一个类型
      state.currentType = state[type][0]
    }
    // 选择日期
    const choseDay = (value) => {
      state.date = value
      state.showDay = false
    }
    // 账单提交到服务器
    const addBill = async () => {
      if (!state.amount) {
        Toast.fail('请输入具体金额')
        return
      }
      // 参数
      const params = {
        amount: Number(state.amount).toFixed(2),
        type_id: state.currentType.id,
        type_name: state.currentType.name,
        date: dayjs(state.date).unix() * 1000,
        pay_type: state.payType === 'expense' ? 1 : 2,
        remark: state.remark || ''
      }
      // 有id代表更新
      if (id) {
        params.id = id
        const result = await axios.post('/bill/update', params)
        state.show = false
        Toast.success('修改成功')
        ctx.emit('refresh')
      } else {
        const result = await axios.post('/bill/add', params)
        // 重置参数
        state.amount = ''
        state.payType = 'expense'
        state.currentType = state.expense[0]
        state.show = false
        state.date = new Date()
        state.remark = ''
        Toast.success('添加成功')
        ctx.emit('refresh')
      }
    }

    return {
      ...toRefs(state),
      toggle,
      inputChange,
      remove,
      choseType,
      changeType,
      choseDay,
      addBill,
      remarkVisible
    }
  }
}
</script>

<style lang="less" scoped>
@import url('../config/custom.less');
.add-wrap {
  padding-top: 12px;
  .header {
    display: flex;
    justify-content: space-between;
    padding: 0 24px;
    .van-icon-cross {
      font-size: 20px;
      color: @color-text-secondary;
    }
    .close {
      display: flex;
      align-items: center;
    }
    .add-btn {
      padding: 0 12px;
      background-color: @primary;
      border-color: @primary;
    }
  }
  .filter {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 24px;
    .type {
      span {
        display: inline-block;
        padding: 4px 12px;
        background-color: #f5f5f5;
        font-size: 12px;
        color: @color-text-caption;
        border-radius: 12px;
        border: 1px solid #f5f5f5;
      }
      .expense {
        margin-right: 6px;
        &.active {
          background-color: #eafbf6;
          border-color: @primary;
          color: @primary;
        }
      }
      .income {
        &.active {
          background-color: #fbf8f0;
          border-color: @text-warning;
          color: @text-warning;
        }
      }
    }
    .time {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 4px 12px;
      background-color: #f0f0f0;
      border-radius: 20px;
      color: @color-text-base;
      .sort-down {
        font-size: 12px;
        margin-left: 5px;
      }
    }
  }
  .money {
    padding-bottom: 12px;
    border-bottom: 1px solid #e9e9e9;
    margin: 0 24px;
    .sufix {
      font-size: 36px;
      font-weight: bold;
      vertical-align: top;
    }
    .amount {
      font-size: 40px;
      padding-left: 10px;
    }
  }
  .animation::after {
    content: '';
    display: inline-block;
    margin-left: 5px;
    width: 2px;
    height: 28px;
    animation: blink 1s infinite steps(1, start);
  }
  @keyframes blink {
    0% {
      background-color: white;
    }
    50% {
      background-color: @color-text-secondary;
    }
    100% {
      background-color: white;
    }
  }
  .type-warp {
    display: flex;
    overflow-x: auto;
    margin: 0 24px 20px;

    * {
      touch-action: pan-x;
    }
    .type-body {
      display: flex;
      white-space: nowrap;
      .type-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 16px 12px 10px 12px;
        .iconfont-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f5f5f5;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          margin-bottom: 5px;
          .iconfont {
            color: @color-text-caption;
            font-size: 20px;
          }
        }
        .expense {
          &.active {
            background-color: @primary;
            .iconfont {
              color: #fff;
            }
          }
        }
        .income {
          &.active {
            background-color: @text-warning;
            .iconfont {
              color: #fff;
            }
          }
        }
      }
    }
  }
  .remark {
    padding: 0 24px 12px;
    color: #4b67e2;
  }
  .van-number-keyboard {
    position: unset;
  }
  .van-dialog__confirm {
    color: @primary;
  }
}
</style>