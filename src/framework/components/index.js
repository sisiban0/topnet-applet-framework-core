import TopnetMescroll from './topnet-mescroll/index.vue';
const components = [TopnetMescroll];
const install = function(Vue) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
};
export default {
  install
};
