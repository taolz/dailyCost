<template>
  <van-cell-group class="item">
    <div class="header-date">
      <div>{{ bill.date }}</div>
      <div class="money">
        <span><b>支</b>{{ expense.toFixed(2) }}</span>
        <span><b>收</b>{{ income.toFixed(2) }}</span>
      </div>
    </div>
    <van-cell
      :class="{ expense: item.pay_type == 1, income: item.pay_type == 2 }"
      v-for="item in bill.bills"
      :key="item.id"
      @click="goToDetail(item)"
      :title="item.type_name"
      :value="`${item.pay_type == 1 ? '-' : '+'}${item.amount}`"
      :label="`${$filters.transTime(item.date)}${
        item.remark ? ' | ' + item.remark : ''
      }`"
    />
  </van-cell-group>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
export default {
  name: 'CardItem',
  props: {
    bill: {
      type: Object,
      default: {}
    }
  },
  setup (props) {
    const router = useRouter()
    const state = reactive({
      income: 0,
      expense: 0
    })

    state.income = props.bill.bills.filter(ele => ele.pay_type == 2).reduce((prev, currItem) => {
      prev += Number(currItem.amount)
      return prev
    }, 0)
    state.expense = props.bill.bills.filter(ele => ele.pay_type == 1).reduce((prev, currItem) => {
      prev += Number(currItem.amount)
      return prev
    }, 0)

    const goToDetail = (item) => {
      router.push({
        path: '/detail',
        query: {
          id: item.id
        }
      })
    }

    return {
      ...toRefs(state),
      goToDetail
    }
  }
}
</script>

<style lang='less' scoped>
@import url('../config/custom.less');
.item {
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 10px;
  box-shadow: 0 0 4px 0px rgba(0, 0, 0, 0.1);
  .header-date {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    background-color: #f9f9f9;
    height: 60px;
    div {
      color: @color-text-base;
    }
    .money {
      span {
        margin-left: 20px;
        b {
          font-weight: normal;
          color: @color-text-caption;
          background-color: #f5f5f5;
          padding: 3px;
          margin-right: 2px;
        }
      }
    }
  }
}
</style>

<style lang='less'>
@import url('../config/custom.less');
.expense {
  .van-cell__value {
    color: @color-text-base!important;
  }
}
.income {
  .van-cell__value {
    color: @text-warning!important;
  }
}
</style>