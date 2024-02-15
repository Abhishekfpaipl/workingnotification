<template>
  <router-view />
</template>

<script>
// App.vue or main component
export default {
  name: 'App',
  created() {
    console.log('Environment:', process.env.NODE_ENV);
  },
};
</script>