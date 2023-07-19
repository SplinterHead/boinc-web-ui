import Vue from "vue";
import router from "./router.js";
import store from "./store";
import App from "./App.vue";
import { BootstrapVue } from "bootstrap-vue";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faAngleRight,
  faArrowRotateLeft,
  faPause,
  faPlay,
  faRotate,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import {
  faApple,
  faLinux,
  faWindows,
} from "@fortawesome/free-brands-svg-icons";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

library.add([
  faAngleRight,
  faApple,
  faArrowRotateLeft,
  faLinux,
  faPause,
  faPlay,
  faRotate,
  faTrashCan,
  faWindows,
]);
Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.use(BootstrapVue);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
  router,
  store,
}).$mount("#app");
