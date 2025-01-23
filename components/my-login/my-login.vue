<template>
  <view class="login-container">
    <!-- 提示登录的图标 -->
    <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
    
    <!-- 登录按钮 -->
    <!-- 可以从 @getuserinfo 事件处理函数的形参中，获取到用户的基本信息，把基础库改成2.16.1 -->
    <button type="primary" class="btn-login" @click="getUserProfile">一键登录</button>
    
    <!-- 登录提示 -->
    <view class="tips-text">登录后尽享更多权益</view>
  </view>
</template>

<script>
  import {mapMutations, mapState} from 'vuex'
  export default {
    computed: {
      ...mapState('m_user', ['redirectInfo'])
    },
    name:"my-login",
    data() {
      return {
        
      };
    },
    methods: {
      ...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
      getUserProfile() {
        uni.getUserProfile({
          desc: '你的授权信息',
          success: (res) => {
            console.log(res.userInfo)
            this.updateUserInfo(res.userInfo)
            this.getToken(res)
          },
          fail: (res) => {
            return uni.$showMsg('您取消了登录授权！')
          }
        })
      },
      // 调用登录接口,换取永久的 token
      async getToken(info) {
        
        // 没有登录接口的开发权限，所以写死 token，跳过判断
        
        // // 调用微信登录接口
        // const [err, res] = await uni.login().catch(err => err)
        // // 判断是否 wx.login() 调用失败
        // if(err || res.errMsg !== 'login:ok') return uni.$showError('登录失败！')
        
        // // 准备参数对象
        // const query = {
        //   code: res.code,
        //   encryptedData: info.encryptedData,
        //   iv: info.iv,
        //   rawData: info.rawData,
        //   signature: info.signature
        // }
        // // 换取 token
        // const {data: loginResult} = await uni.$http.post('/api/public/v1/users/wxlogin', query)
        // if(loginResult.meta.status !== 200) return uni.$showMsg('登录失败！')
        uni.$showMsg('登录成功！')
        // 更新 vuex 中的 token
        // this.updateToken(loginResult.message.token)
        
        // 写死 token
        this.updateToken("Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo")
        
        this.navigateBack()
      },
      // 返回登录之前的页面
      navigateBack() {
        if(this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
          uni.switchTab({
            // 要导航到的页面地址
            url: this.redirectInfo.from,
            complete: () => {
              // 导航成功后，把 vuex 中的 redirectInfo 对象重置为 null
              this.updateRedirectInfo(null)
            }
          })
        }
      }
    }
  }
</script>

<style lang="scss">
.login-container {
  // 登录盒子的样式
  height: 750rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
  position: relative;
  overflow: hidden;
  
  // 绘制登录盒子底部的半椭圆造型
  &::after {
    content: ' ';
    display: block;
    position: absolute;
    width: 100%;
    height: 40px;
    left: 0;
    bottom: 0;
    background-color: white;
    border-radius: 100%;
    transform: translateY(50%);
  }
  
  // 登录按钮
  .btn-login {
    width: 90%;
    border-radius: 100px;
    margin: 15px 0;
    background-color: #c00000;
  }
  
  // 按钮下方的提示消息
  .tips-text {
    font-size: 12px;
    color: gray;
  }
}
</style>