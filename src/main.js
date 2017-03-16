// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App.vue';
//引入路由插件
import vueRouter from 'vue-router';
//引入菜单模块
import menu from './components/vue/menu.vue';
//引入评价模块
import estimate from './components/vue/estimate.vue';
//引入商户模块
import merchants from './components/vue/merchants.vue';

//使用路由
Vue.use(vueRouter);

var router = new vueRouter({
  //添加高亮显示
  linkActiveClass:'active',
  routes: [
    {
      path: '/',
      component: menu
    },
    {
      //菜单页面路由
      path: '/menu',
      component: menu
    },
    {
      //评价页面路由
      path: '/estimate',
      component: estimate
    },
    {
      //商户页面路由
      path: '/merchants',
      component: merchants
    },
  ]
});


new Vue({
  el: '#app',
  //渲染路由
  router:router,
  render:c=>c(App)
});
