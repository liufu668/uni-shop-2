<template>
  <view>
    <!-- 使用自定义的搜索组件 -->
    <view class="search-box">
      <my-search @myclick="gotoSearch"></my-search>
    </view>
    
    <!-- 使用 uswiper 可以快速生成轮播图代码结构 -->
    <!-- 轮播图区域 -->
    <swiper :indicator-dots = "true" :autoplay = "true" :interval = "3000" :duration = "1000" :circular = "true">
      <!-- 循环渲染轮播图的 item 项 -->
      <swiper-item v-for = "(item, i) in swiperList" :key = "i">
        <navigator class = "swiper-item" :url = "'../../subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
          <!-- 动态绑定图片的 src 属性 -->
          <image :src = "item.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper> 
    <view class = "nav-list">
      <view class = "nav-item" v-for = "(item, i) in navList" :key = "i" @click = "navClickHandler(item)">
        <image :src = "item.image_src" class = "nav-img"></image>
      </view>
    </view>
    <!-- 楼层区域 -->
    <view class = "floor-list">
      <!-- 楼层 item 项 -->
      <view class = "floor-item" v-for = "(item, i) in floorList" :key = "i">
        <!-- 楼层标题 -->
        <image :src = "item.floor_title.image_src" class = "floor-title"></image>
        <!-- 楼层图片区域 -->
        <view class = "floor-img-box">
          <!-- 左侧大图片的盒子 -->
          <navigator class = "left-img-box" :url = "item.product_list[0].url">
            <image :src = "item.product_list[0].image_src" :style = "{width: item.product_list[0].image_width + 'rpx'}" mode = "widthFix"></image>
          </navigator>
          <!-- 右侧 4 个小图片的盒子 -->
          <view class = "right-img-box">
            <navigator class = "right-img-item" v-for = "(item2, i2) in item.product_list.slice(1)" :key = "i2" :url = "item2.url">
              <image :src = "item2.image_src" mode = "widthFix" :style = "{width: item2.image_width + 'rpx'}"></image>
            </navigator>
          </view>
        </view>
      </view>
    </view>
    
  </view>
</template>

<script>
  import badgeMix from '@/mixins/tabbar-badge.js'
  export default {
    // 将 badgeMix 混入到当前页面中进行使用
    mixins: [badgeMix],
    data() {
      return {
        // 轮播图的数据列表，默认为空数组
        swiperList: [],
        // 分类导航的数据列表
        navList: [],
        // 楼层的数据列表
        floorList:[],
      };
    },
    onLoad() {
      // 在小程序页面刚加载时，调用获取轮播图数据的方法
      this.getSwiperList()
      // 调用获取数据的方法
      this.getNavList()
      // 获取楼层数据的方法
      this.getFloorList()
    },
    methods: {
      // 获取轮播图数据的方法
      async getSwiperList() {
        // 发起请求
        const {data: res} = await uni.$http.get('/api/public/v1/home/swiperdata')
        // 请求失败
        if(res.meta.status !== 200) return uni.$showMsg()
        
        // 请求成功，为 data 中的数据赋值
        this.swiperList = res.message
      },
      // 定义获取数据的方法
      async getNavList() {
        const {data: res} = await uni.$http.get('/api/public/v1/home/catitems')
        if(res.meta.status !== 200) return uni.$showMsg()
        this.navList = res.message
      },
      // 切换到分类页面
      navClickHandler(item) {
        if(item.name == '分类') {
          uni.switchTab({
            url: '/pages/cate/cate'
          })
        }
      },
      // 获取楼层列表数据
      async getFloorList() {
        const {data: res} = await uni.$http.get('/api/public/v1/home/floordata')
        console.log(res)
        if(res.meta.status !== 200) return uni.$showMsg()
        
        // 通过双层 forEach 循环,处理 URL 地址
        res.message.forEach(floor => {
          floor.product_list.forEach(prod => {
            prod.url = '../../subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
          })
        })
        this.floorList = res.message
      },
      gotoSearch() {
        uni.navigateTo({
          url: '/subpkg/search/search'
        })
      }
    },
    
  }
</script>

<style lang="scss">
  .search-box {
    // 设置定位效果为“吸顶”
    position: sticky;
    // 吸顶的位置
    top: 0;
    // 提高层级，防止被轮播图覆盖
    z-index: 999;
  }
  // 轮播图样式
swiper {
  height: 330rpx;
  
  .swiper-item,
  image {
    // 图片撑满swiper容器
    width: 100%;
    height: 100%;
  }
}
// 分类样式
.nav-list {
  display: flex;
  justify-content: space-around;
  margin: 15px 0;
  
  .nav-img {
    width: 128rpx;
    height: 140rpx;
  }
}
// 楼层样式
.floor-title {
  height: 60rpx;
  width: 100%;
  display: flex;
}
// 楼层图片样式
.right-img-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.floor-img-box {
  display: flex;
  padding-left: 10rpx;
}
</style>
