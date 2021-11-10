import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
import store from './store'
const app=new App({store})
app.$mount()
