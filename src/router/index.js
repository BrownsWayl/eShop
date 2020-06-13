import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
// import Welcome from '../components/Welcome.vue'
Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        {
          path: '/welcome',
          component: () => import('../components/Welcome.vue')
        },
        {
          path: '/users',
          component: () => import('../components/user/Users.vue')
        },
        {
          path: '/roles',
          component: () => import('../components/power/Roles.vue')
        },
        {
          path: '/rights',
          component: () => import('../components/power/Rights.vue')
        }
      ]
    }
  ]
})
