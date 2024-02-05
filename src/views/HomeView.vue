<template>
  <div class="d-flex flex-column justify-content-center align-items-center mt-5">
    <h1>Version 1.0</h1>

    <div v-if="currentStep === 'installPopup'" class="install-popup">
      <div class="install-popup-content">
        <p>Do you want to install this app?</p>
        <button class="btn btn-outline-dark" @click="installApp">Install</button>
        <button class="btn btn-outline-dark" @click="dismissInstall">Dismiss</button>
      </div>
    </div>

    <GeoLocation v-if="currentStep === 'geoLocation'" />

    <div class="d-flex gap-3 align-items-center my-3">
      <router-link to="/login" class="btn btn-primary">Login</router-link>
      <router-link to="/registration" class="btn btn-primary">Register</router-link>
    </div>

    <button class="btn btn-primary" @click="getNoti">Push Data to Api</button>

    <div class="container my-5 py-3">
      <h5 v-if="userLocation">
        User Coordinate: {{ userLocation.latitude }}, {{ userLocation.longitude }}
      </h5>
    </div>
  </div>
</template>

<script>
import GeoLocation from "@/components/GeoLocation.vue";
import axios from 'axios';
export default {
  name: "HomeView",
  components: {
    GeoLocation,
  },
  data() {
    return {
      deferredPrompt: null,
      showInstallButton: false,
      showInstallPopup: false,
      users: null,
      responseData: null,
      userLocation: null,
      currentStep: 'installPopup',
    };
  },
  created() {
    window.addEventListener('beforeinstallprompt', this.handleInstallPrompt);
  },
  unmounted() {
    window.removeEventListener('beforeinstallprompt', this.handleInstallPrompt);
  },
  mounted() {
    const token = localStorage.getItem('token');
    if (token) {
      // axios.get('https://pwanew.clobug.co.in/api/user', {
      axios.get('https://server.wsgbrand.in/api/user', {
        headers: { "Authorization": `Bearer ${token}` }
      }).then((response) => {
        this.users = response.data
        console.log(response.data)
      })
        .catch((error) => {
          console.error(error)
        })
    }
    this.subscribeForNotifications();
    const geoPrompt = this.$refs.geoPrompt;
    if (geoPrompt && !geoPrompt.isLocationPermissionGranted) {
      geoPrompt.openLocationPopup();
    }
    this.getUserLocation();
  },
  methods: {
    getUserLocation() {
      if (navigator.permissions) {
        navigator.permissions.query({ name: "geolocation" }).then((result) => {
          if (result.state === "granted") {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                this.userLocation = { latitude, longitude };
                console.log("User Location:", this.userLocation); // Add this line for debugging
                this.showLocationPopup = false;
                this.$emit("geolocationAllowed", this.userLocation);
              },
              (error) => {
                console.error(`Error getting location: ${error.message}`);
                this.showLocationPopup = false;
              },
              {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
              }
            );
          } else {
            console.error("Geolocation permission not granted.");
            this.showLocationPopup = false;
            this.$emit("geolocationDenied");
          }
        });
      } else {
        console.error("Geolocation is not supported by your browser");
        this.showLocationPopup = false;
      }
    },
    handleInstallPrompt(event) {
      // Prevent the default behavior to show the browser's install prompt
      event.preventDefault();
      // Store the event for later use
      this.deferredPrompt = event;
      // Show a browser-style alert immediately
      this.showInstallAlert();
    },
    showInstallAlert() {
      this.showInstallPopup = true;
    },
    installApp() {
      // If the user clicks "Install," show the browser's install prompt
      this.deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      this.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          // Now the app is installed
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        // Reset the deferredPrompt
        this.deferredPrompt = null;
        // Move to the next step
        this.currentStep = 'geoLocation';
      });
    },
    dismissInstall() {
      this.showInstallPopup = false;
      // Move to the next step
      this.currentStep = 'geoLocation';
    },
    subscribeForNotifications() {
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        navigator.serviceWorker.ready
          .then((registration) => {
            const subscribeOptions = {
              userVisibleOnly: true,
              applicationServerKey: "BHaGoupz6SaaiUM6EOTtsVSVjAklaOV3Y4lmexYmEV7XwDDiA4LkPLfqmvpaF4FcyyHEZ2LvLQUp9sHpuW0K96s"
            };
            return registration.pushManager.subscribe(subscribeOptions);
          })
          .then((pushSubscription) => {
            console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
            // You can store the pushSubscription data as needed
            const { keys, endpoint } = pushSubscription.toJSON();
            // Store the keys in localStorage
            localStorage.setItem('p256dhKey', keys.p256dh);
            localStorage.setItem('authKey', keys.auth);
            localStorage.setItem('endpoint', endpoint)
            console.log('Stored p256dhKey in localStorage:', keys.p256dh);
            console.log('Stored authKey in localStorage:', keys.auth);
            // this.storePushSubscription(pushSubscription);
          })
          .catch((error) => {
            console.error('Error subscribing for notifications:', error);
          });
      } else {
        console.warn('Push notifications are not supported in this browser.');
      }
    },
    getNoti() {
      const token = localStorage.getItem('token');
      const keys = {
        "auth": localStorage.getItem('authKey'),
        "p256dh": localStorage.getItem('p256dhKey')
      };
      const data = {
        endpoint: localStorage.getItem('endpoint'),
        keys
      };
      const config = {
        headers: { "Authorization": `Bearer ${token}` }
      };
      axios.post('https://server.wsgbrand.in/api/push_store', data, config)
        .then((response) => {
          console.log('data sent', response);
        })
        .catch((error) => {
          console.error('error sending data', error);
        });
    },
  }
};
</script>
<style> .install-popup {
   position: fixed;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%);
   background: #e14e5f;
   padding: 20px;
   border: 1px solid #ccc;
   border-radius: 8px;
   box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
   animation: slideIn 0.5s ease-in-out
 }

 .install-popup-content {
   text-align: center;
 }

 .install-popup button {
   margin: 10px;
   padding: 8px 16px;
   cursor: pointer;
 }

 @keyframes slideIn {
   from {
     transform: translate(-50%, -70%);
     opacity: 0;
   }

   to {
     transform: translate(-50%, -50%);
     opacity: 1;
   }
 }
</style>