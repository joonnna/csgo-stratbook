import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import '@/styles/core.scss';
import { library, config } from '@fortawesome/fontawesome-svg-core';
import {
  faEdit,
  faTrashAlt,
  faBan,
  faFilm,
  faCheck,
  faFilter,
  faPlus,
  faTools,
  faUtensils,
  faBoxes,
  faUsers,
  faChess,
  faCopy,
  faCrown,
  faGamepad,
  faBomb,
  faSave,
  faShareAlt,
  faDownload,
  faQuestionCircle,
  faInfoCircle,
  faTimes,
  faComment,
  faWifi,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VueTippy, { TippyComponent } from 'vue-tippy';

Vue.use(VueTippy, {
  directive: 'tippy',
  animateFill: true,
  distance: 5,
  duration: [300, 100],
  delay: [300, 0],
  animation: 'scale',
  popperOptions: {
    modifiers: {
      // preventOverflow: {
      //   enabled: false,
      // },
    },
  },
});
Vue.component('tippy', TippyComponent);

config.autoAddCss = false;
library.add(
  faEdit,
  faTrashAlt,
  faBan,
  faFilm,
  faCheck,
  faFilter,
  faPlus,
  faTools,
  faUtensils,
  faBoxes,
  faUsers,
  faChess,
  faCopy,
  faCrown,
  faGamepad,
  faBomb,
  faSave,
  faShareAlt,
  faTwitter,
  faDownload,
  faQuestionCircle,
  faInfoCircle,
  faTimes,
  faComment,
  faWifi,
  faChevronLeft,
  faChevronRight
);
Vue.component('fa-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

store.dispatch('loadDataFromStorage');

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
