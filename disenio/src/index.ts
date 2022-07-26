// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'


const createPersistedState = require('vuex-persistedstate').default

import BootstrapVue from "bootstrap-vue"
Vue.use(BootstrapVue)
Vue.use(require('vue-moment'));

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import 'vue-datetime/dist/vue-datetime.css';


import App from './App.vue'

import UserLogin from './components/UserLogin.vue'
import Conexiones from './components/Conexiones.vue'
import Element from './components/Module/Element.vue'
import Label from './components/Module/Label.vue'

import router from './router'

import layout from './modules/layout'
import general from './modules/general'
import info from './modules/info'
import viewer3d from './modules/viewer3d'
import exportar from './modules/exportar'
import projectSettings from './modules/settings'

import CalcoContainer from './components/CalcoContainer.vue'
import CalcoFour from './components/CalcoFour.vue'
import CalcoTres from './components/CalcoTres.vue'
import CalcoDouble from './components/CalcoDouble.vue'
import CalcoSimple from './components/CalcoSimple.vue'
import CalcoFondo from './components/CalcoFondo.vue'


import Notification from './components/Taller/notification/NotificationComp.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faTimes,
  faPlus,
  faCheck,
  faEdit,
  faSquare,
  faCheckSquare,
  faCircle,
  faCaretRight,
  faCaretDown,
  faRuler,
  faSyncAlt,
  faArrowsAlt,
  faBorderStyle,
  faFileExport,
  faEye,
  faEyeSlash,
  faBorderAll
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {ProjectSettings} from "./models/models"

library.add(faBorderAll,faTimes, faPlus, faCheck, faEdit, faSquare, faCheckSquare, faCircle, faCaretRight, faCaretDown, faRuler, faSyncAlt, faArrowsAlt, faBorderStyle, faFileExport, faEye, faEyeSlash)

Vue.config.productionTip = false

Vue.use(Vuex)
Vue.use(require('vue-shortkey'))

Vue.component('vue-simple-spinner', require('vue-simple-spinner'))
Vue.component("notification", Notification)


const Datetime = require('vue-datetime').default;
Vue.use(Datetime);

/* eslint-disable no-new */
const store = new Vuex.Store({
  modules: {
    layout,
    info,
    general,
    viewer3d,
    exportar,
    projectSettings
  },
  plugins: [createPersistedState()]
})

Vue.component('login', UserLogin)
Vue.component('conexiones', Conexiones)
Vue.component('mod-element', Element)
Vue.component('mod-label', Label)


Vue.component('calco-double', CalcoDouble)
Vue.component('calco-simple', CalcoSimple)
Vue.component('calco-container', CalcoContainer)
Vue.component('calco-tres', CalcoTres)
Vue.component('calco-four', CalcoFour)
Vue.component('calco-fondo', CalcoFondo)

Vue.component('FontAwesomeIcon', FontAwesomeIcon)

// para controlar nombre de usuario y boton de logout 
// escucha de método login en UserLogin
export const EventBus = new Vue();

const token =  localStorage.getItem('token');
// console.log('token-->', token)

export const HTTP = axios.create({
   baseURL: process.env.BACKEND_BASE_URL,
   headers: {
    Accept: 'application/json',
    // Authorization: `Bearer ${localStorage.getItem('token')}`
    Authorization: 'Bearer ' + token
  }
})

// Filters
Vue.filter('round', (value: number) => Math.round(value * 100) / 100)
Vue.filter('filled', (value: string) => value == null || value == '' ? '-' : value)

/* eslint-disable no-new */
const vue = new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
