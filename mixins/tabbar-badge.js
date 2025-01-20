import {mapGetters} from 'vuex'

// 导出一个 mixin 对象
export default {
  computed: {
    ...mapGetters('m_cart', ['total']),
  },
  watch: {
    // 监听 total 值的变化 
    total() {
      this.setBadge()
    }
  },
  onShow() {
    // 在页面刚展示时，设置数字徽标
    this.setBadge()
  },
  methods: {
    setBadge() {
      // 调用 uni.setTabBarBadge() 方法,为购物车设置右上角的徽标
      uni.setTabBarBadge({
        // 索引
        index: 2,
        // 必须是字符串
        text: this.total + ''
      })
    }
  }
}