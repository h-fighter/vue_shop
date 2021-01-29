import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
Vue.use(Router)

const router = new Router({
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
      path: '/Home',
      component: Home,
      redirect: '/welcome',
      children: [
        {
          path: '/welcome',
          component: Welcome
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path === '/Login') return next()
  const tokenInfo = window.sessionStorage.getItem('token')
  if (!tokenInfo) {
    return next('/Login')
  }
  next()
})

export default router
