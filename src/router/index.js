import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path:"/login",
    name:"LoginPage",
    component:()=>import('@/views/LoginPage.vue')
  },
  {
    path:"/registration",
    name:"RegistrationPage",
    component:()=>import('@/views/RegistrationPage.vue')
  },
  {
    path:"/offline",
    name:"offline",
    component:()=>import('@/views/OfflinePage.vue')
  }

];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
