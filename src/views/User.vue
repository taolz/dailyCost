<template>
  <div class="user">
    <div class="head">
      <img class="avatar" src="https://s.yezgea02.com/1606836859539/onpeice.png"  alt=""/>
      <div class="info">
        <span class="name">{{ user.username || '' }}</span>
        <span class="slogen">个性签名：{{ user.signature || '' }}</span>
      </div>
    </div>
    <div class="content">
      <van-cell
        icon="edit"
        @click="visibleSig = true"
        title="修改个性签名"
        is-link
      />
      <van-cell icon="setting-o" to="/account" title="账户安全" is-link />
      <van-cell
        icon="good-job-o"
        @click="visibleRate = true"
        title="软件评分"
        is-link
      />
      <van-cell icon="smile-o" title="占位" />
    </div>
    <div class="footer">
      <van-button class="logout" type="primary" size="large" @click="logout">
        退出登录
      </van-button>
    </div>
    <div class="other">
      <van-dialog
        v-model:show="visibleSig"
        @confirm="confirmSig"
        title="个性签名"
        show-cancel-button
      >
        <van-field
          v-model="signature"
          rows="2"
          autosize
          type="textarea"
          maxlength="20"
          placeholder="请输入个性签名"
          show-word-limit
        />
      </van-dialog>
      <van-dialog
        class="rate"
        v-model:show="visibleRate"
        title="软件评分"
        show-cancel-button
      >
        <van-rate
          class="rate"
          v-model="rate"
          allow-half
          void-icon="star"
          void-color="#eee"
        />
      </van-dialog>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import axios from '../utils/axios'
export default {
  name: 'User',
  setup () {
    const router = useRouter()
    const state = reactive({
      user: {},
      signature: '',
      visibleSig: false,
      visibleRate: false,
      rate: 4.5
    })
    onMounted( async () => {
      await getUserInfo()
    })
    // 取得个人信息
    const getUserInfo = async () => {
      const { data } = await axios.get('/user/get_userinfo')
      state.user = data
      state.signature = data.signature
    }
    // 修改签名确认
    const confirmSig = async () => {
      const { data } = await axios.post('/user/edit_signature', {
        signature: state.signature
      })
      state.user = data
      state.signature = data.signature
    }
    // 退出登录
    const logout = () => {
      localStorage.removeItem('token')
      router.push({ path: '/login' })
    }
    return {
      ...toRefs(state),
      confirmSig,
      logout
    }
  }
}
</script>

<style lang='less' scoped>
@import url('../config/custom.less');
.user {
  min-height: 100%;
  background-color: #f5f5f5;
  padding: 12px;
  .head {
    display: flex;
    background: linear-gradient(315deg, #7fcea4 0%, #39be77 100%);
    padding: 12px;
    border-radius: 4px;
    margin-bottom: 12px;
    .avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: 3px solid #fff;
      margin-right: 10px;
    }
    .info {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .name {
        font-size: 18px;
        color: #fff;
        font-weight: 500;
      }
      .slogen {
        color: #fff;
        background: rgba(0, 0, 0, 0.1);
        padding: 1px 5px;
        border-radius: 10px;
      }
    }
  }
  .footer {
    .logout {
      display: block;
      width: 90%;
      margin: 20px auto 0;
      background-color: @primary;
      border-color: @primary;
    }
  }
}
// 语法
// 外层 /deep/ 第三方组件 {
//     样式
// }
.other /deep/ .van-dialog__content {
  text-align: center;
  padding: 20px 0;
}
</style>
