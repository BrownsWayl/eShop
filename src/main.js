import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'
import axios from 'axios'
Vue.prototype.$axios = axios
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = sessionStorage.getItem('token')
  // console.log(config)
  return config
})
Vue.component('tree-table', TreeTable)

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const token = sessionStorage.getItem('token')
  // console.log(token)
  if (!token) return next('/login')
  next()
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
