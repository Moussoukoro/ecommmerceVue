import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";
import ArgonDashboard from "./argon-dashboard";
 // import axios from 'axios';  // Importez la configuration axios
import { startTokenRefreshInterval } from './refreshToken';  // Importez la fonction de rafraîchissement du jeton

const appInstance = createApp(App);
appInstance.use(store);
appInstance.use(router);
appInstance.use(ArgonDashboard);
appInstance.mount("#app");
startTokenRefreshInterval();  // Démarrez l'intervalle de rafraîchissement du jeton