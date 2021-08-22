import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      alias: "/home",
      name: "home",
      component: () => import("./components/Home")
    },
    {
      path: "/edit/:id",
      name: "app-details",
      component: () => import("./components/Edit")
    },
/*     {
      path: "/",
      alias: "/tutorials",
      name: "tutorials",
      component: () => import("./components/Home")
    },
    {
      path: "/tutorials/:id",
      name: "tutorial-details",
      component: () => import("./components/Tutorial")
    }, */
  ]
});
