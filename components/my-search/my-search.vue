<template>
  <view class = "my-search-container" :style="{'background-color': bgcolor}">
    <!-- 使用view组件模拟 input 输入框的样式 -->
    <view class = "my-search-box" :style="{'border-radius': radius + 'px'}" @click="searchBoxHandler">
      <uni-icons type = "search" size = "17"></uni-icons>
      <text class = "placeholder">搜索</text>
    </view>
  </view>
</template>

<script>
  export default {
    name:"my-search",
    props: {
      // 背景颜色 
      bgcolor: {
        type: String,
        default: '#C00000'
      },
      // 圆角尺寸
      radius: {
        type: Number,
        default: 18
      }
    },
    data() {
      return {
        
      };
    },
    methods: {
      // 点击模拟的input输入框
      searchBoxHandler() {
        // console.log('~~~~~')
        // 触发外界通过@click绑定的click事件处理函数，cate页面
        this.$emit('myclick')
      }
    }
  }
</script>

<style lang="scss">
  .my-search-container {
    // background-color: #c00000;
    height: 50px;
    padding: 0 10px;
    display: flex;
    align-items: center;
  }
  .my-search-box {
    height: 36px;
    background-color: #ffffff;
    // border-radius: 15px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    .placeholder {
      font-size: 15px;
      margin-left: 5px;
    }
  }
</style>