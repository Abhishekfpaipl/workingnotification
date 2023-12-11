import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

createApp(App).use(store).use(router).mount("#app");
window.addEventListener('offline', () => {
    if (!navigator.onLine) {
        // If offline, redirect to the offline page
        router.push({ name: 'offline' });
    }
});

window.addEventListener('online', () => {
    // If online, redirect back to the home page or any other route
    router.push({ name: 'home' }); // Adjust the route accordingly
});