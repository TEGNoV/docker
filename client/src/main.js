import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "vuetify/dist/vuetify.min.css";
import Vuetify, {
  VApp, // required
  VNavigationDrawer,
  VFooter,
  VToolbar,
  VFadeTransition
} from "vuetify/lib";
import { Ripple } from "vuetify/lib/directives";
import { store } from "./store/store";
import VueFusionCharts from "vue-fusioncharts";
import FusionCharts from "fusioncharts";

// register VueFusionCharts component
Vue.use(VueFusionCharts, FusionCharts);
import VueImg from "v-img";
Vue.use(VueImg);
Vue.use(Vuetify);
const ops = {
  theme: {
    dark: false,
    themes: {
      dark: {
        primary: "lime",
        secondary: "#FF7100",
        error: "#FF0046",
        blue: {
          accent1: "#4FC3F7",
          accent2: "#29B6F6"
        }
      },
      light: {
        primary: "#4FC3F7",
        secondary: "#00c3ff",
        error: "#FF0046",
        blue: {
          accent1: "#4FC3F7",
          accent2: "#29B6F6"
        }
      }
    },
    components: {
      VApp,
      VNavigationDrawer,
      VFooter,
      VToolbar,
      VFadeTransition
    },
    directives: {
      Ripple
    },
    options: {
      customProperties: true
    }
  }
};
// Plugins
// MaterialDashboard plugin
import MaterialDashboard from "./material-dashboard";
import GlobalComponents from "./globalComponents";
import GlobalDirectives from "./globalDirectives";

Vue.use(MaterialDashboard);
Vue.use(GlobalComponents);
Vue.use(GlobalDirectives);

import axios from "axios";
axios.defaults.withCredentials = true;

Vue.config.productionTip = false;

export const bus = new Vue();
/* eslint-disable no-new */
window.bus = new Vue({
  vuetify: new Vuetify(ops),
  store,
  el: "#app",
  router,
  template: "<App/>",
  components: { App },
  render: h => h(App)
});
