import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useUserStore } from '../store'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: () => import('../layout/index.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        meta: { title: '首页' }
      },
      {
        path: 'article/:id',
        name: 'Article',
        component: () => import('../views/Article.vue'),
        meta: { title: '文章详情' }
      },
      {
        path: 'archives',
        name: 'Archives',
        component: () => import('../views/Archives.vue'),
        meta: { title: '归档' }
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('../views/About.vue'),
        meta: { title: '关于我' }
      }
    ]
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('../views/admin/Login.vue'),
    meta: { title: '后台登录' }
  },
  {
    path: '/admin',
    component: () => import('../layout/AdminLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: () => import('../views/admin/Dashboard.vue'),
        meta: { title: '控制台' }
      },
      {
        path: 'articles',
        name: 'AdminArticles',
        component: () => import('../views/admin/ArticleManage.vue'),
        meta: { title: '文章管理' }
      },
      {
        path: 'articles/edit',
        name: 'AdminArticleEdit',
        component: () => import('../views/admin/ArticleEdit.vue'),
        meta: { title: '编辑文章' }
      },
      {
        path: 'ai-writing',
        name: 'AdminAiWriting',
        component: () => import('../views/admin/AiWriting.vue'),
        meta: { title: 'AI 写作中心' }
      },
      {
        path: 'comments',
        name: 'AdminComments',
        component: () => import('../views/admin/AdminComments.vue'),
        meta: { title: '评论管理' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, _from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} - 个人博客`
  }

  const userStore = useUserStore()
  if (to.path.startsWith('/admin') && to.path !== '/admin/login') {
    if (!userStore.token) {
      next('/admin/login')
      return
    }

    try {
      if (!userStore.userInfo) {
        await userStore.hydrateProfile()
      }
      next()
    } catch {
      next('/admin/login')
    }
    return
  }

  next()
})

export default router
