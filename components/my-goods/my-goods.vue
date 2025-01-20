<template>
  <view class="goods-item">
    <!-- 商品左侧图片区域 -->
    <view class="goods-item-left">
      <!-- 商品勾选状态，是否已经添加进购物车，v-if 控制组件的显示与隐藏 -->
      <radio :checked="goods.goods_state" color="#C00000" v-if="showRadio" @click="radioClickHandler"></radio>
      <image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
    </view>
    <!-- 商品右侧信息区域 -->
    <view class="goods-item-right">
      <!-- 商品标题 -->
      <view class="goods-name">{{goods.goods_name}}</view>
      <view class="goods-info-box">
        <!-- 商品价格，toFixed(2)把价格处理成带两位小数 -->
        <view class="goods-price">￥{{goods.goods_price.toFixed(2)}}</view>
        <!-- 商品数量 -->
        <uni-number-box :min="1" :value="goods.goods_count" @change="numChangeHandler" v-if="showNum"></uni-number-box>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    name:"my-goods",
    // 定义 props 属性，用来接收外界传递到当前组件的数据
    props: {
      // 商品的信息对象
      goods: {
        type: Object,
        default: {},
      },
      // 是否展示图片左侧的radio
      showRadio: {
        type: Boolean,
        // 默认不展示
        default: false
      },
      // 是否展示价格右侧的 NumberBox 组件
      showNum: {
        type: Boolean,
        default: false
      }
    },
    data() {
      
      return {
        // 默认的空图片
        defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
      };
    },
    methods: {
      // radio 组件的点击事件处理函数
      radioClickHandler() {
        // 通过 this.$emit()触发外界通过@绑定的 radio-change 事件,并传递参数
        this.$emit('radio-change', {
          goods_id: this.goods.goods_id,
          goods_state: !this.goods.goods_state
        })
      },
      // NumberBox 组件的 change 事件处理函数
      numChangeHandler(val) {
        // 通过 this.$emit 触发外界通过 @ 绑定的 num-change 事件
        this.$emit('num-change', {
          goods_id: this.goods.goods_id,
          // 商品的最新数量
          goods_count: +val
        })
      }
    }
  }
</script>

<style lang="scss">
.goods-item {
  // 让 goods-item 项占满整个屏幕的宽度
  width: 750rpx;
  box-sizing: border-box;
  display: flex;
  padding: 10px 5px;
  border-bottom: 1px solid #f0f0f0;
  
  .goods-item-left {
    margin-right: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .goods-pic {
      width: 100px;
      height: 100px;
      display: block;
    }
  }
  
  .goods-item-right {
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    
    .goods-name {
      font-size: 13px;
    }
    
    .goods-info-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .goods-price {
      font-size: 16px;
      color: #c00000;
    }
  }
}
</style>