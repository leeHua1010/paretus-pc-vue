import { createRouter, createWebHashHistory } from "vue-router";
import Layout from "~/layout/index.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: Layout,
      children: [
        {
          path: "/",
          component: () => import("~/pages/home/index.vue"),
        },
      ],
    },
    {
      path: "/auth/login",
      component: () => import("~/pages/login/index.vue"),
    },
    {
      path: "/auth/register",
      component: () => import("~/pages/register/index.vue"),
    },
    {
      path: "/article",
      component: Layout,
      children: [
        {
          path: "create",
          component: () => import("~/pages/create-artice/index.vue"),
        },
        {
          path: "detail",
          component: () => import("~/pages/article-detail/index.vue"),
        },
      ],
    },
    {
      path: "/profile",
      component: Layout,
      children: [
        {
          path: "info",
          component: () => import("~/pages/profile/index.vue"),
        },
      ],
    },
    {
      path: "/:pathMatch(.*)*",
      component: () => import("~/components/not-found/index.vue"),
    },
  ],
});

export function setupRouter(app) {
  app.use(router);
}

export default router;
