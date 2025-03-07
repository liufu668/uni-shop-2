<template>
  <view v-if="goods_info.goods_name" class="goods-detail-container">
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item, i) in goods_info.pics" :key="i">
        <image :src="item.pics_big" @click="preview(i)"></image>
      </swiper-item>
    </swiper>
    <!-- 商品信息区域 -->
    <view class="goods-info-box">
      <!-- 商品价格 -->
      <view class="price">￥{{goods_info.goods_price}}</view>
      <view class="goods-info-body">
        <!-- 商品名称 -->
        <view class="goods-name">{{goods_info.goods_name}}</view>
        <view class="favi">
          
          <uni-icons type="star" size="18" color="gray"></uni-icons>
          <text>收藏</text>
        </view>
      </view>
      <!-- 运费 -->
      <view class="yf">快递：免运费 -- {{cart.length}}</view>
    </view>
    <!-- 商品详情信息 -->
    <rich-text :nodes="goods_info.goods_introduce"></rich-text>
    
    <!-- 商品导航组件 -->
    <view class="goods_nav">
      <!-- @click 响应左侧的按钮，@buttonClick 响应右侧的按钮 -->
      <uni-goods-nav :fill="true" :options="options" :buttonGroup="buttonGroup" @click="onClick" @buttonClick="buttonClick"/>
    </view>
  </view>
</template>

<script>
  // 从 vuex 中按需导入 mapState 辅助方法
  import { mapState } from 'vuex'
  // 按需导入 mapMutations 这个辅助方法
  import { mapMutations } from 'vuex'
  // 按需导入 mapGetters 这个辅助方法
  import { mapGetters } from 'vuex'
  
  export default {
    watch: {
      // 定义 total 侦听器，指向一个配置对象
      total: {
        handler(newVal){
          // 通过数组的 find() 方法,找到购物车按钮的配置对象
          const findResult = this.options.find(x => x.text === '购物车')
          if(findResult) {
            // 动态为购物车按钮的 info 属性赋值
            findResult.info = newVal
          }
        },
        // 声明此侦听器，是否在页面初次加载完毕后立即调用
        immediate: true
      }
    },
    computed: {
      // 调用 mapState 方法,把 m_cart 模块中的 cart 数据映射到当前页面中，作为计算属性来使用
      ...mapState('m_cart', ['cart']),
      ...mapGetters('m_cart', ['total']),
    },
    data() {
      return {
        // 商品详情对象
        goods_info: {},
        // 左侧按钮组的配置对象
        options: [{
          icon: 'shop',
          text: '店铺'
        }, {
          icon: 'cart',
          text: '购物车',
          info: 0
        }],
        // 右侧按钮组的配置对象 
        buttonGroup: [{
          text: '加入购物车',
          backgroundColor: '#ff0000',
          color: '#fff'
        }, {
          text: '立即购买',
          backgroundColor: '#ffa200',
          color: '#fff'
        }]
      };
    },
    onLoad(options) {
      // 获取商品 ID
      const goods_id = options.goods_id
      this.getGoodsDetail(goods_id)
    },
    methods: {
      // 请求商品详情数据
      async getGoodsDetail(goods_id) {
        const { data: res } = await uni.$http.get('/api/public/v1/goods/detail', { goods_id })
        if(res.meta.status !== 200) return uni.$showMsg()
        
        // 使用字符串的 replace() 方法,为 img 标签添加行内的 style 样式，解决图片底部空白间隙的问题
        res.message.goods_introduce = res.message.goods_introduce.replace(/<img/g, '<img style="display:block;"').replace(/webp/g, 'jpg')
        // 为 data 中的数据赋值
        this.goods_info = res.message
      },
      // 实现轮播图的预览效果
      preview(i) {
        uni.previewImage({
          // 预览时，默认显示图片的索引 
          current: i,
          // 所有图片 url 地址的数组
          urls: this.goods_info.pics.map(x => x.pics_big)
        })
      },
      onClick(e) {
        console.log(e)
        if(e.content.text === '购物车') {
          // 切换到购物车页面
          uni.switchTab({
            url: '/pages/cart/cart'
          })
        }
      },
      
      // 把 m_cart 模块中的 addToCart 方法映射到当前页面使用  
      ...mapMutations('m_cart', ['addToCart']),
      
      // 右侧按钮的点击事件处理函数
      buttonClick(e) {
        // 判断是否点击了“加入购物车”按钮
        if(e.content.text === '加入购物车') {
          // 组织一个商品的信息对象
          const goods = {
            goods_id: this.goods_info.goods_id,
            goods_name: this.goods_info.goods_name,
            goods_price: this.goods_info.goods_price,
            // 商品的数量
            goods_count: 1, 
            // 商品的图片
            goods_small_logo: this.goods_info.goods_small_logo,
            // 商品的勾选状态
            goods_state: true
          }
        // 通过 this 调用映射过来的 addToCart 方法,把商品信息对象存储到购物车中
        this.addToCart(goods)
      }
    }
  }
}
</script>

<style lang="scss">
swiper {
  height: 750rpx;
  
  image {
    width: 100%;
    height: 100%;
  }
}

// 商品信息
.goods-info-box {
  padding: 10px;
  padding-right: 0;
  
  .price {
    color: #c00000;
    font-size: 18px;
    margin: 10px 0;
  }
  
  .goods-info-body {
    display: flex;
    justify-content: space-between;
    
    .goods-name {
      font-size: 13px;
      padding-right: 10px;
    }
    
    // 收藏区域
    .favi {
      width: 120px;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-left: 1px solid #efefef;
      color: gray;
    }
  }
  // 运费
  .yf {
    margin: 10px 0;
    font-size: 12px;
    color: gray;
  }
}
.goods-detail-container {
  padding-bottom: 50px;
}
// 
.goods_nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
</style>
