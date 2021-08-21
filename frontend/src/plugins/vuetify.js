import Vue from 'vue';
import Vuetify from 'vuetify/lib';

import '@mdi/font/css/materialdesignicons.css'
Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
            light: {
                dali: '#ffffff'
            },
            dark: {
                primary: '#fb8c00',
                dali: '#121212'
            },
        }
    },
    icons: {
        iconfont: 'mdi',
    }
});