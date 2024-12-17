import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/Register.vue')
    },
    {
      path: '/view',
      name: 'view',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('../views/test.vue')
    },
    {
      path: '/admin',
      name: 'adminRouter',
      meta: {
        requireAuth: true,
        roles: ['admin']
      },
      component: () => import('../views/AdminIndex.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../components/AdminComponents/SelectUser.vue')
        },
        {
          path: 'selectbill',
          name: 'selectbill',
          component: () => import('../components/AdminComponents/SelectUser.vue')
        },
        {
          path: 'selectresidue',
          name: 'selectresidue',
          component: () => import('../components/AdminComponents/SelectCommodity.vue')
        },
        {
          path: 'printconsumptionorders',
          name: 'printconsumptionorders',
          component: () => import('../components/AdminComponents/PrintConsumptionOrders.vue')
        },
        {
          path: 'reservation',
          name: 'reservation',
          component: () => import('../components/AdminComponents/Reservation.vue')
        },
        {
          path: 'addcommodity',
          name: 'addcommodity',
          component: () => import('../components/AdminComponents/addCommodity.vue')
        }
      ]
    },
    {
      path: '/user',
      name: 'UserRouter',
      meta: {
        requireAuth: true,
        roles: ['user']
      },
      component: () => import('../views/UserIndex.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../components/UserComponents/Commodity.vue')
        },
        {
          path: 'commodity',
          name: 'commodity',
          component: () => import('../components/UserComponents/Commodity.vue')
        },
        {
          path: 'shoppingcart',
          name: 'shoppingcart',
          component: () => import('../components/UserComponents/ShoppingCart.vue')
        },
        {
          path: 'commodityorigin',
          name: 'commodityorigin',
          component: () => import('../components/UserComponents/CommodityOrigin.vue')
        },
        {
          path: 'userreservation',
          name: 'userreservation',
          component: () => import('../components/UserComponents/UserReservation.vue')
        },
        {
          path: 'userinformation',
          name: 'userinformation',
          component: () => import('../components/UserComponents/UserInformation.vue')
        },
        {
          path: 'commoditydetils',
          name: 'commoditydetils',
          component: () => import('../components/UserComponents/CommodityDetail.vue')
        }
      ]
    }
  ]
})

//检查登录状态
router.beforeEach((to, from, next) => {
  const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true'

  if (to.matched.some((record) => record.meta.requireAuth)) {
    if (!isLoggedIn) {
      next({
        path: '/login',
        //保存想要访问的地址，登录后再重定向过去
        query: { redirect: to.fullPath, message: '您还未登录!' }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
