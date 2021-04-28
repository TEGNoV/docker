import Vue from 'vue'
import Router from 'vue-router'
import DashboardLayout from "@/pages/Layout/DashboardLayout.vue"; 
import Journal from "@/pages/Journal/Journal.vue";
import Dashboard from "@/pages/Dashboard/Dashboard.vue";
import Upload from "@/pages/Upload.vue";
import Login from "@/pages/Login.vue";
import Log from "@/pages/Log/Log.vue";
import Risk from "@/pages/Risk/Risk.vue";
Vue.use(Router)
export default new Router({
  mode: 'history',
  routes: [
    {
      path: "/",
      component: DashboardLayout,
      redirect: "/dashboard",
      children: [
        {
          path: "dashboard", 
          name: "Dashboard",
          component: Dashboard
        },
        {
          path: "risk", 
          name: "Risk",
          component: Risk
        },
          {
            path: "journal", 
            name: "Journal",
            component: Journal
          },
        {
          path: "log",
          name: "log",
          component: Log
        },
        {
          path: "upload",
          name: "Upload",
          component: Upload
        }
      ]
    }, {
      path: "/login",
      component: Login,
      name: "Login"
    }
  ]
})

