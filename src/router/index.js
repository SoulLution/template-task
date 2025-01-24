import Vue from 'vue'
import VueRouter from 'vue-router'
import AllTemplates from '../views/AllTemplates.vue'
import TemplateById from '../views/TemplateById.vue'
import LoginPage from '../views/LoginPage.vue'
import store from "@/store"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'all-templates',
    meta: { auth: true },
    component: AllTemplates
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/template/:id',
    name: 'template',
    meta: { auth: true },
    component: TemplateById
  },
  {
    path: '*',
    redirect: '/'
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const token = store.state.profile.token;

  if (to.matched.some((record) => record.meta.auth)) {
    if (!token) {
      return next({ path: "/login" });
    }
  }

  next();
});

export default router
