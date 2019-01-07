import 'font-awesome/css/font-awesome.css';
import Vue from 'vue';

import App from './App';

import './config/bootstrap';
import './config/msgs';
import store from './config/store';
import router from './config/router';

Vue.config.productionTip = false;

// TEMPORARIO!
require('axios').defaults.headers.common['Authorization'] = 'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwibmFtZSI6IlJhZmFlbCBDYW5kZWlyYSIsImVtYWlsIjoicm9vdEByb290LmNvbSIsImFkbWluIjp0cnVlLCJpYXQiOjE1NDY4NzU1MjAsImV4cCI6MTU0NzEzNDcyMH0.zdclnn4pSS4XJHm_Wx_R-no3B2Al4lBObVz6Q916UWY';

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app');