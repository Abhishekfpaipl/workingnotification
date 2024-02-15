<template>
  <div>
    <!-- Custom Location Permission Popup -->
    <div v-if="showLocationPopup && !isLocationPermissionGranted" class="location-popup">
      <p>Would you like to share your location?</p>
      <button @click="allowLocation">Allow</button>
      <button @click="denyLocation">Deny</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GeoLocation',
  data() {
    return {
      showLocationPopup: false,
      location: null,
      isLocationPermissionGranted: false,
      userLocation: null,
    };
  },
  mounted() {
    this.checkLocationPermission();
  },
  methods: {
    allowLocation() {
      this.getLocation(); 
    },
    denyLocation() {
      this.showLocationPopup = false;
      this.$emit('closeGeoPrompt');
    }, 
    getLocation() {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            this.showLocationPopup = false;
            this.isLocationPermissionGranted = true;
            this.$emit('geolocationAllowed', this.location);
          },
          (error) => {
            alert(`Error getting location: ${error.message}`);
            this.showLocationPopup = false;
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
          }
        );
      } else {
        alert('Geolocation is not supported by your browser');
        this.showLocationPopup = false;
      }
    },
    checkLocationPermission() {
      if ('geolocation' in navigator) {
        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
          if (result.state === 'granted') {
            this.isLocationPermissionGranted = true;
          } else {
            this.showLocationPopup = true;
          }
        });
      } else {
        alert('Geolocation is not supported by your browser');
        this.showLocationPopup = false;
      }
    },
  },
};
</script>


<style>
.location-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ccc;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  text-align: center;
}
</style>
