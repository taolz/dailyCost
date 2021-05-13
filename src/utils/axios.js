import axios from 'axios';
import { Toast } from 'vant';
import { useRouter } from 'vue-router';
// 默认配置
axios.defaults.baseURL = "//47.99.134.126:7008/api"
axios.defaults.withCredentials = true
axios.defaults.headers["X-Requested-With"] = "XMLHttpRequest"
axios.defaults.headers["token"] = localStorage.getItem("token") || "";
axios.defaults.headers.post["Content-Type"] = "application/json";
// 拦截器
axios.interceptors.response.use((res) => {
  const router = useRouter()
  if (typeof res.data != "object") {
    Toast.fail("服务端异常！")
    return Promise.reject(res)
  }
  if (res.data.code != 200) {
    if (res.data.msg) {
      Toast.fail(res.data.msg)
    }
    if (res.data.msg == 401) {
      router.push({
        path: "/login"
      })
    }
    return Promise.reject(res.data)
  }
  return res.data
})

export default axios