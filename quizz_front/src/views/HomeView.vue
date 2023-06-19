<template>
  <div class="central level1 horizontal">
    <ActiveRooms></ActiveRooms>
    <UserInfo></UserInfo>
  </div>
</template>

<script>
import UserInfo from '../components/UserInfo.vue';
import ActiveRooms from '../components/ActiveRooms.vue';

export default {
  components: {
    UserInfo,
    ActiveRooms
  }
};
</script>

<style lang="less" scoped>

</style>