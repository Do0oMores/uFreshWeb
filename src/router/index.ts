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
      path: '/notification',
      name: 'notification',
      component: () => import('../views/Notification.vue')
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
          component: () => import('../components/AdminComponents/UserManage.vue')
        },
        {
          path: 'usermanage',
          name: 'usermanage',
          component: () => import('../components/AdminComponents/UserManage.vue')
        },
        {
          path: 'commoditymanage',
          name: 'commoditymanage',
          component: () => import('../components/AdminComponents/CommodityManage.vue')
        },
        {
          path: 'ordermanage',
          name: 'ordermanage',
          component: () => import('../components/AdminComponents/OrderManage.vue')
        },
        {
          path: 'aftersalesmanage',
          name: 'aftersalesmanage',
          component: () => import('../components/AdminComponents/AfterSalesManage.vue')
        },
        {
          path: 'addcommodity',
          name: 'addcommodity',
          component: () => import('../components/AdminComponents/addCommodity.vue')
        },
        {
          path: 'dataanalysis',
          name: 'dataanalysis',
          component: () => import('../components/AdminComponents/DataAnalysis.vue')
        },
        {
          path:'waste',
          name:'waste',
          component:()=>import('../components/AdminComponents/Waste.vue')
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
          path: 'myorders',
          name: 'myorders',
          component: () => import('../components/UserComponents/MyOrders.vue')
        },
        {
          path: 'userinformation',
          name: 'userinformation',
          component: () => import('../components/UserComponents/UserInformation.vue')
        },
        {
          path: 'commoditydetails/:commodityId',
          name: 'commoditydetils',
          component: () => import('../components/UserComponents/CommodityDetail.vue')
        },
        {
          path: 'oldorders',
          name: 'oldorders',
          component: () => import('../components/UserComponents/OldOrders.vue')
        },
        {
          path: 'orderdetail/:orderId',
          name: 'orderdetail',
          component: () => import('../components/UserComponents/OrderDetail.vue')
        },
        {
          path: 'aftersales/:orderId',
          name: 'aftersales',
          component: () => import('../components/UserComponents/AfterSales.vue')
        },
        {
          path: 'aftersaledetail/:aftersalesId',
          name: 'aftersaledetail',
          component: () => import('../components/UserComponents/AfterSaleDetail.vue')
        },
        {
          path:'comment/:commentId',
          name: 'comment',
          component:()=>import('../components/UserComponents/Comment.vue')
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
