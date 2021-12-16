import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
const path = require("path");
export const loadStore = function (files) {
  const modules = {};
  files.keys().forEach((key) => {
    const dir = path.dirname(key, ".js");
    const name = dir.split("/")[1];
    modules[name] = files(key).default;
  });
  const store = new Vuex.Store({
    modules,
  });
  return store;
};
const store = loadStore(require.context("@/pages/", true, /store.js$/));

export default store;
