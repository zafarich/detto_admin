import AuthMiddleware from "src/router/middlewares/auth";

const routes = [
  {
    path: "/auth/",
    component: () => import("src/layouts/AuthLayout.vue"),
    children: [
      {
        path: "login",
        name: "login",
        component: () => import("src/pages/auth/LoginPage.vue"),
      },
    ],
  },
  {
    path: "/",
    meta: { middlewares: [AuthMiddleware] },
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "dashboard",
        component: () => import("src/pages/DashboardPage.vue"),
      },
      {
        path: "products",
        name: "products",
        component: () => import("src/pages/products/IndexPage.vue"),
      },
      {
        path: "menu",
        name: "menu",
        component: () => import("src/pages/menu/IndexPage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
