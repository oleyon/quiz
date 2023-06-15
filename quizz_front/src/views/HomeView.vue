<template>
  <div>
    <h2>Активные комнаты</h2>
    <div v-for="room in rooms" :key="room.id">
      <h3>{{ room.title }}</h3>
      <p>Количество команд: {{ room.numberOfTeams }}</p>
      <p>Название квиза: {{ room.quiz.title }}</p>
      <p>Описание квиза: {{ room.quiz.description }}</p>
      <button @click="joinRoom(room.id)">Войти</button>
      <hr />
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