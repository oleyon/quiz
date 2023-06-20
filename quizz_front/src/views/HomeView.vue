<template>
  <div>
    <h1 class="central">Сайт квизов</h1>
    <div class="central level1 horizontal">
      <ActiveRooms></ActiveRooms>
      <UserInfo></UserInfo>
    </div>
    <h2 class="central about">
      Данный веб-сервис является проектом дипломной работы.
      <br>
      Преподаватели могут создвавать квизы, а также комнаты.
      <br>
      Студенты могут присоединяться к комнатам и играть в командах.
    </h2>
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
.about {
  margin-top: 100px;
}
</style>