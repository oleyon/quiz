<template>
  <div class="central level1">
    <h2 class="central">Активные комнаты</h2>
    <div class="room__room-area level2" v-for="room in rooms" :key="room.id">
      <h2>{{ room.title }}</h2>
      <h3 style="font-size: 22px;">Количество команд: &nbsp {{ room.numberOfTeams }}</h3>
      <h3 style="font-size: 22px;">Название квиза: &nbsp {{ room.quiz.title }}</h3>
      <h3 style="font-size: 22px;">Описание квиза: &nbsp {{ room.quiz.description }}</h3>
      <button @click="joinRoom(room.id)">Войти</button>
    </div>
    <PasswordModal v-if="isModalOpen" @passwordEntered="handlePasswordEntered" @close="closeModal"></PasswordModal>
  </div>
</template>

<script>
import roomDataService from '@/services/RoomDataService';
import PasswordModal from '../components/PasswordModal.vue';

export default {
  components: {
    PasswordModal
  },
  data() {
    return {
      rooms: [],
      chosenRoomId: 0,
      isModalOpen: false
    };
  },
  mounted() {
    roomDataService.getActiveRooms()
    .then(response => {
      this.rooms = response.data;
    })
    .catch(er => {
      console.log(er)
    })
  },
  methods: {
    joinRoom(roomId) {
      this.chosenRoomId = roomId;
      this.isModalOpen = true;
    },
    openModal() {
      this.isModalOpen = true;
    },
    handlePasswordEntered(password) {
      this.$router.push({
        path: '/room',
        query: {
          roomId: this.chosenRoomId,
          password: password
        }
      })
    },
    closeModal() {
      this.isModalOpen = false;
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../common_styles.less";

.room{
  &__room-area {
    background: @div2;
    border-radius: 18px;
    width: 80%;
    margin-left: 10%;
    margin-bottom: 10px;
    padding: 20px;
    min-height: fit-content;
  }
  &__caption {
    font-size: 22px;
  }
}
.caption {
  font-size: x-large;
}
</style>