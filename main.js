// 导入网络请求的包
import {$http} from '@escook/request-miniprogram'

uni.$http = $http

// 请求的根路径
$http.baseUrl = 'https://api-hmugo-web.itheima.net'

// 封装弹框的方法
uni.$showMsg = function(title = '数据加载失败！', duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none'
  })
}

// 挂载一个请求拦截器
$http.beforeRequest = function(options) {
  uni.showLoading({
    title: '数据加载中...'
  })
}

// 响应拦截器
$http.afterRequest = function() {
  uni.hideLoading()
}

// // #ifndef VUE3
// import Vue from 'vue'
// import App from './App'
// // 导入 store 的实例对象
// import store from '@/store/store.js'

// Vue.config.productionTip = false

// App.mpType = 'app'

// const app = new Vue({
//     ...App,
//     // 将 store 挂载到 Vue 实例上
//     store
// })
// app.$mount()
// // #endif

// // #ifdef VUE3
// import { createSSRApp } from 'vue'
// import App from './App.vue'
// export function createApp() {
//   const app = createSSRApp(App)
//   return {
//     app
//   }
// }
// // #endif


// #ifndef VUE3
import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
...App,
})

app.$mount()
// #endif

// #ifdef VUE3
import {createSSRApp} from 'vue'
import store from '@/store/store.js'
import App from './App'
export function createApp() {
const app = createSSRApp(App)
app.use(store)
return {
app
}
}
// #endif