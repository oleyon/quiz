<template>
  <Login></Login>
</template>

<script>
import userDataService from '../services/UserDataService';
import { mapActions } from 'vuex';
import Login from '../components/Login.vue';

export default {
  components: {
    Login
  }
};
</script>

<style lang="less" scoped>
</style>