<template>
  <view class="my-container">
    <!-- 用户未登录时，显示登录组件 -->
    <my-login v-if="!token"></my-login>
    
    <!-- 用户登录后，显示用户信息组件 -->
    <my-userinfo v-else></my-userinfo>
  </view>
</template>

<script>
  import badgeMix from '@/mixins/tabbar-badge.js'
  import {mapState} from 'vuex'
  export default {
    // 将 badgeMix 混入到当前页面中进行使用
    mixins: [badgeMix],
    computed: {
      ...mapState('m_user', ['token']),
    },
    data() {
      return {
        
      };
    }
  }
</script>

<style lang="scss">
.my-container {
  height: 100%;
}
</style>
