<template>
  <view>
    <view class="search-box">
      <!-- 使用 uni-ui 提供的搜索组件 -->
      <uni-search-bar @input="input" :radius="100" cancelButton="none"></uni-search-bar>
    </view>
    <!-- 搜索建议列表 -->
    <view class="sugg-list" v-if="searchResults.length !== 0">
      <view class="sugg-item" v-for="(item, i) in searchResults" :key="i" @click="gotoDetail(item.goods_id)">
        <view class="goods-name">{{item.goods_name}}</view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>
    <!-- 搜索历史记录 -->
    <view class="history-box" v-else>
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="17" @click="cleanHistory"></uni-icons>
      </view>
      <view class="history-list">
        <uni-tag :text="item" v-for="(item, i) in histories" :key="i" @click="gotoGoodsList(item)"></uni-tag>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 延时器的 timerId
        timer: null,
     
        // 搜索关键词
        kw: '',
        // 搜索结果列表
        searchResults: [],
        // 搜索关键词的历史记录
        historyList: []
      };
    },
    methods: {
      input(e) {
        // 清除timer对应的延时器
        clearTimeout(this.timer)
        // 重新启动一个延时器，并把timerId赋值给 this.timer
        this.timer = setTimeout(() => {
          // 如果 500 毫秒内,没有触发新的输入事件,则为搜索关键词赋值
          this.kw = e
          // 根据关键词，查询搜索建议列表
          this.getSearchList()
          console.log(e)
        }, 500)
      },
      // 根据关键词搜索商品建议列表
      async getSearchList() {
        // 判断关键词是否为空
        if(this.kw === '') {
          this.searchResults = []
          return 
        }
        // 发起请求,获取搜索建议列表
        // await 用于等待 uni.$http.get 异步请求的结果。这样可以在请求完成后继续执行代码，避免回调地狱（callback hell）。

        const { data: res } = await uni.$http.get('/api/public/v1/goods/qsearch', { query: this.kw })
        if(res.meta.status !== 200) return uni.$showMsg()
        this.searchResults = res.message
        // 保存搜索关键词
        this.saveSearchHistory()
      },
      // 跳转到商品详情页面
      gotoDetail(goods_id) {
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods_id
        })
      },
      // 保存搜索关键词为历史记录
      saveSearchHistory() {
        // this.historyList.push(this.kw)
        
        // 将 Array 数组转化为 Set 对象
        const set = new Set(this.historyList)
        // 先删再加，是为了更新它在搜索历史里的位置
        set.delete(this.kw)
        set.add(this.kw)
        // 将 Set 对象转化为 Array 数组
        this.historyList = Array.from(set)
        // 将搜索历史记录持久化存储到本地
        uni.setStorageSync('kw', JSON.stringify(this.historyList))
      },
      // 清空搜索历史记录
      cleanHistory() {
        // 清空 data 中保存的搜索历史 
        this.historyList = []
        // 清空本地存储中的记录的搜索历史
        uni.setStorageSync('kw', '[]')
      },
      gotoGoodsList(kw) {
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?query=' + kw
        })
      }
    },
    computed: {
      histories() {
        // 新建一个内存无关的数组，再进行搜索历史记录反转
        return [...this.historyList].reverse()
      }
    },
    onLoad() {
      // 加载本地存储的搜索历史记录
      this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
    }
  }
</script>

<style lang="scss">

  // 搜索框
  .search-box {
    position: sticky;
    top: 0;
    z-index: 999;
  }
  // 搜索建议列表
  .sugg-list {
    padding: 0 5px;
    
    .sugg-item {
      font-size: 12px;
      padding: 13px 0;
      border-bottom: 1px solid #efefef;
      display: flex;
      align-items: center;
      justify-content: space-between;
      
      .goods-name {
        // 文字不允许换行（单行文本）
        white-space: nowrap;
        // 溢出部分隐藏
        overflow: hidden;
        // 文本溢出后,用...代替
        text-overflow: ellipsis;
        margin-right: 3px;
      }
    }
  }
  
  .history-box {
    padding: 0 5px;
    
    .history-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      font-size: 13px;
      border-bottom: 1px solid #efefef;
    }
    
    .history-list {
      display: flex;
      flex-wrap: wrap;
      
      .uni-tag {
        margin-top: 5px;
        margin-right: 5px;
      }
    }
  }
</style>
