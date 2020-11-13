// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import _ from 'lodash';
import { Tree, Input, Button, Checkbox } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App';
import router from './router';

Vue.config.productionTip = false;
Vue.prototype._ = _;
Vue.use(Tree);
Vue.use(Input);
Vue.use(Button);
Vue.use(Checkbox);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
