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
      path: "/:id",
      name: "home-details",
      component: () => import("./components/Tutorial")
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
