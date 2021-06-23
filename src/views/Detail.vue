<template>
  <div class="detail">
    <Header title="账单详情" />
    <div class="card">
      <div class="type">
        <span
          :class="{
            expense: detail.pay_type === 1,
            income: detail.pay_type === 2
          }"
        >
          <i
            class="iconfont"
            :class="detail.type_id ? typeMap[detail.type_id].icon : 0"
          />
        </span>
        <span>{{ detail.type_name || '' }}</span>
      </div>
      <div class="amount expense" v-if="detail.pay_type === 1">
        -{{ detail.amount }}
      </div>
      <div class="amount income" v-else>+{{ detail.amount }}</div>
      <div class="info">
        <div class="time">
          <span>记录时间</span>
          <span>{{ $filters.transYDM(Number(detail.date)) }}</span>
        </div>
        <div class="remark">
          <span>备注</span>
          <span>{{ detail.remark || '-' }}</span>
        </div>
      </div>
      <div class="operation van-hairline--top">
        <span class="van-hairline--right" @click="deleteDetail">
          <van-icon name="delete" />删除
        </span>
        <span @click="openModal"><van-icon name="edit" />编辑</span>
      </div>
      <PopAdd
        v-if="detail.id"
        ref="popAddRef"
        :detail="detail"
        @refresh="getDetail"
      />
    </div>
  </div>
</template>
 
<script>
import { onMounted, reactive, ref, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Header from '../components/Header.vue'
import PopAdd from '../components/PopAdd.vue'
import { typeMap } from '@/utils'
import axios from '../utils/axios'
import { Toast, Dialog } from 'vant'

export default {
  name: 'Detail',
  components: {
    Header,
    PopAdd
  },
  setup () {
    const route = useRoute()
    const router = useRouter()
    const { id } = route.query
    const popAddRef = ref(null)
    const state = reactive({
      typeMap,
      detail: {}
    })

    onMounted( () => {
      getDetail()
    })

    const getDetail = async () => {
      const { data } = await axios.get(`/bill/detail?id=${id}`)
      state.detail = data
    }

    const openModal = () => {
      popAddRef.value.toggle()
    }

    const deleteDetail = () => {
      Dialog.confirm({
        title: '删除',
        message: '确认删除账单？',
      }).then(async () => {
        const { data } = await axios.post('/bill/delete', { id })
        Toast.success('删除成功')
        router.back()
      })
    }

    return {
      ...toRefs(state),
      popAddRef,
      openModal,
      getDetail,
      deleteDetail
    }
  }
}
</script>

<style lang='less' scoped>
@import url('../config/custom.less');
.detail {
  height: 100%;
  background-color: #f5f5f5;
  padding: 12px 24px 0;
  .card {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 12px;
    background-color: #fff;
    padding: 0 12px;
    .type {
      padding: 24px 0 12px;
      span:nth-of-type(1) {
        display: inline-block;
        width: 22px;
        height: 22px;
        line-height: 20px;
        color: #fff;
        border-radius: 50%;
        text-align: center;
        margin-right: 8px;
      }
      .expense {
        background-color: @primary;
      }
      .income {
        background-color: @text-warning;
      }
    }
    .amount {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 24px;
    }
    .info {
      width: 100%;
      font-size: 14px;
      text-align: left;
      .time {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: 12px;
        span:nth-of-type(1) {
          flex: 3;
          color: @color-text-caption;
        }
        span:nth-of-type(2) {
          flex: 9;
        }
      }
      .remark {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        margin-bottom: 12px;
        span:nth-of-type(1) {
          flex: 3;
          color: @color-text-caption;
        }
        span:nth-of-type(2) {
          flex: 9;
          color: @color-text-base;
        }
      }
    }
    .operation {
      display: flex;
      align-items: center;
      justify-content: space-around;
      width: 100%;
      height: 50px;
      font-size: 16px;
      .van-icon {
        margin-right: 4px;
      }
      span {
        display: flex;
        align-items: center;
      }
      span:nth-of-type(1) {
        color: red;
      }
    }
  }
}
</style>