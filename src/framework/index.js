import Vue from "vue";
import store from "./store";
import api from "./api";
import * as helper from "./helper";
import http from "./http";
import topnet from "./components";
export const initApp = () => {
  Vue.use(topnet);
  Vue.prototype.$api = api;
  Vue.prototype.$http = http;
  Vue.prototype.$helper = helper;
  Vue.config.productionTip = false;
  return {
    Vue,
  };
};
export { helper, http, api, store };
