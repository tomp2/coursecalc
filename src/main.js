import Vue from 'vue'
import App from './App.vue'
import store from './store/store'
import Vuex from 'vuex'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false
Vue.use(Vuex)

new Vue({
    store,
    vuetify,
    render: h => h(App),
    beforeCreate () {
        this.$store.commit('initStore')
    },
}).$mount('#app')

store.subscribe((mutation, state) => {
    localStorage.setItem('vuex_store', JSON.stringify(state))
})

