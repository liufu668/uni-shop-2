<template>
  <view class="my-settle-container">
    <!-- 全选区域 -->
    <label class="radio" @click="changeAllState">
      <radio color="#C00000" :checked="isFullCheck"><text>全选</text></radio>
    </label>
    
    <!-- 合计区域 -->
    <view class="amount-box">
      合计：<text class="amount">￥{{checkedGoodsAmount}}</text>
    </view>
    
    <!-- 结算按钮 -->
    <view class="btn-settle" @click="settlement">结算({{checkedCount}})</view>
  </view>
</template>

<script>
  import {mapGetters, mapMutations, mapState} from 'vuex'
  
  export default {
    name:"my-settle",
    computed: {
      ...mapGetters('m_cart', ['checkedCount', 'total', 'checkedGoodsAmount']),
      // addstr 是详细的收货地址
      ...mapGetters('m_user', ['addstr']),
      ...mapState('m_user', ['token']),
      ...mapState('m_cart', ['cart']),
      // 是否全选
      isFullCheck() {
        return this.total === this.checkedCount
      },
    },
    data() {
      return {
        // 倒计时的秒数
        seconds: 3,
        // 定时器的 Id
        timer: null
      };
    },
    methods: {
      ...mapMutations('m_cart', ['updateAllGoodsState']),
      ...mapMutations('m_user', ['updateRedirectInfo']),
      changeAllState() {
        // 修改购物车中所有商品的选中状态
        this.updateAllGoodsState(!this.isFullCheck)
      },
      // 点击了结算按钮
      settlement() {
        // 判断是否勾选了要结算的商品
        if(!this.checkedCount) return uni.$showMsg('请选择要结算的商品！')
        
        // 判断用户是否选择了收货地址
        if(!this.addstr) return uni.$showMsg('请选择收货地址！')
        
        // 判断用户是否登录了
        // if(!this.token) return uni.$showMsg('请先登录！')
        if(!this.token) return this.delayNavigate()
        
        // 实现微信支付功能
        this.payOrder()
      },
      // 展示倒计时的提示消息
      showTips(n) {
        uni.showToast({
          icon: 'none',
          title: '请登录后再结算！' + n + ' 秒后自动跳转到登录页',
          // 为页面添加透明遮罩，防止点击穿透
          mask: true,
          // 1.5秒后自动消失
          duration: 1500
        })
      },
      // 延迟导航到 my 页面
      delayNavigate() {
        // 重置秒数
        this.seconds = 3
        this.showTips(this.seconds)
        
        // 创建定时器，每隔 1 秒执行一次，并将定时器的 Id 存储到 timer 中
        this.timer = setInterval(() => {
          this.seconds--
          
          if(this.seconds <= 0) {
            // 清除定时器
            clearInterval(this.timer)
            
            // 跳转到 my 页面
            uni.switchTab({
              url: '/pages/my/my',
              // 页面跳转成功之后的回调函数
              success: () => {
                this.updateRedirectInfo({
                  // 导航方式
                  openType: 'switchTab',
                  // 从哪个页面跳转过去的
                  from: '/pages/cart/cart'
                })
              }
            })
            
            // 终止后续代码的运行
            return
          }
          
          this.showTips(this.seconds)
        }, 1000)
      },
      // 微信支付
      async payOrder() {
        // 组织订单的信息对象
        const orderInfo = {
          order_price: 0.01,
          consignee_addr: this.addstr,
          goods: this.cart.filter(x => x.goods_state).map(x => ({
            goods_id: x.goods_id, 
            goods_number: x.goods_count, 
            goods_price: x.goods_price,
          }))
        }
        
        // 发起请求创建订单
        const {data: res} = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
        if(res.meta.status !== 200) return uni.$showMsg('创建订单失败！')
        // 得到服务器响应的“订单编号”
        const orderNumber = res.message.order_number
        // console.log(orderNumber)
        
        // 无法支付，没有开发权限
        
        // 发起请求获取订单的支付信息，进行预支付
        const {data: res2} = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', {order_number: orderNumber})
        if(res2.meta.status !== 200) return uni.$showError('预付订单生成失败！')
        // 得到订单支付相关的必要参数
        const payInfo = res2.message.pay
        console.log(payInfo)
        
        // // 发起微信支付
        // const [err, succ] = await uni.requestPayment(payInfo)
        // if(err) return uni.$showMsg('订单未支付！')
        // // 完成了支付,进一步查询支付的结果 
        // const {data: res3} = await uni.$http.post('/api/public/v1/my/orders/chkOrder', {order_number: orderNumber})
        
        // if(res3.meta.status !== 200) return uni.$showMsg('订单未支付！')
        // uni.showToast({
        //   title: '支付完成！',
        //   icon: 'success'
        // })
      }
    }
  }
</script>

<style lang="scss">
.my-settle-container {
  // 底部固定位
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background-color: white;
  display: flex;
  // 两侧贴边对齐
  justify-content: space-between;
  align-items: center;
  padding-left: 5px;
  font-size: 14px;
  
  .radio {
    display: flex;
    align-items: center;
  }
  
  .amount {
    color: #c00000;
  }
  
  .btn-settle {
    height: 50px;
    min-width: 100px;
    background-color: #c00000;
    color: white;
    line-height: 50px;
    text-align: center;
    padding: 0 10px;
  }
}
</style>