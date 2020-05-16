import Vue from 'vue';
import Vuex from 'vuex';
import Controller from './Controller';

import 'es6-promise/auto';

Vue.config.productionTip = false;
Vue.use(Vuex);

(()=> {

    const store = new Vuex.Store({
        state: {
        },
        mutations: {
        }
    });
    new Vue({
        el: '#app',
        store,
        components: { Controller },
        template: '<Controller/>',
    });

})()
