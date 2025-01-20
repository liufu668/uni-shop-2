export default {
  // 开启命名空间
  namespaced: true,
  
  state: () => ({
    // 读取本地的收货地址数据，初始化 address 对象
    address: JSON.parse(uni.getStorageSync('address') || '{}'),
  }),
  
  // 方法
  mutations: {
    // 更新收货地址
    updateAddress(state, address) {
      state.address = address
      this.commit('m_user/saveAddressToStorage')
    },
    // 将 address 持久化存储到本地 mutations 方法
    saveAddressToStorage(state) {
      uni.setStorageSync('address', JSON.stringify(state.address))
    },
  },
  
  // 数据包装器
  getters: {
    // 收货详细地址的计算属性
    addstr(state) {
      if(!state.address.provinceName) return ''
      
      // 拼接省、市、区、详细地址的字符串，并返回给用户
      return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
    }
  },
}