import {createStore} from 'vuex'
// 导入购物车的 vuex 模块
import moduleCart from '@/store/cart.js'
// 导入用户的 vuex 模块
import moduleUser from '@/store/user.js'
// 创建 Store 实例对象
const store = createStore({
  // TODO：挂载 store 模块
  modules: {
  // 挂载购物车的 vuex 模块，模块内成员的访问路径被调整为 m_cart，例如：
  // 购物车模块中 cart 数组的访问路径是 m_cart/cart
  'm_cart': moduleCart,
  'm_user': moduleUser,
  }
})
// 向外共享 Store 的实例对象
export default store