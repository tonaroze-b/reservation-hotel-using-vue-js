import { createApp } from 'vue'
import App from './App.vue'
import Room from './components/Room.vue'
import Res from './components/Res.vue'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import './style.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUser, faChevronDown, faPlusCircle, faExclamationTriangle, faMale, faChild, faBaby, faTrashAlt, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons'

library.add(
    faUser,
    faChevronDown,
    faPlusCircle,
    faExclamationTriangle,
    faMale,
    faChild, 
    faBaby,
    faTrashAlt,
    faMinus,
    faPlus
)
// Create app
const app = createApp(App)
// app coponents
app.component('font-awesome-icon', FontAwesomeIcon)
app.component('Room', Room)
app.component("Res", Res);
// app mount
app.mount('#app')
