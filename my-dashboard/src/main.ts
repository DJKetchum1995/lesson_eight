import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import './style.css'
import App from './App.vue'

import Home from './views/Home.vue'

const routes = [
	{ path: '/', component: Home }
]

const router = createRouter({
	history: createWebHistory(),
	routes,
})

const vuetify = createVuetify({
	components,
	directives,
	icons: {
		defaultSet: 'mdi',
	},
})

createApp(App).use(router).use(vuetify).mount('#app')
