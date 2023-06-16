<template>
  <div class="main1 central level1">
    <h2>Создать комнату</h2>
    <form @submit.prevent="createRoom">
      <div>
        <div class="room__caption">
          Название комнаты
        </div>
        <input type="text" v-model="title" placeholder="Название" required />
        <div class="room__caption">
          Количество команд
        </div>
        <input type="number" v-model="numberOfTeams" placeholder="кол-во команд" required min="1"/>
        <div class="room__caption">
          Время на выполнение квеста
        </div>
        <input type="number" v-model="quizTime" placeholder="Длительность квиза (с)" required min="1"/>
        <div class="room__caption">
          Пароль комнаты
        </div>
        <input type="пароль" v-model="password" placeholder="Пароль (по желанию)"/>
      </div>
      <div>
        <div class="room__caption">
          Выбор квиза
        </div>
        <select class="room__select" v-model="selectedQuiz" required>
          <option v-for="quiz in quizzes" :key="quiz.id" :value="quiz.id">{{ quiz.title }}</option>
        </select>
      </div>
      <br>
      <button class="room__button" type="submit">Создать комнату</button>
    </form>
  </div>
</template>

<script>
import quizDataService from '@/services/QuizDataService';
import roomDataService from '@/services/RoomDataService';

export default {
  data() {
    return {
      quizzes: [],
      selectedQuiz: 0,
      title: '',
      numberOfTeams: 1,
      quizTime: 60,
      password: ''
    };
  },
  created() {
    this.getQuizzes();
  },
  methods: {
    getQuizzes() {
      try {
        quizDataService.getAll()
        .then(response => {
          this.quizzes = response.data
        });
      } catch (ex) {
        console.log(ex);
      }
    },
    createRoom() {
      const roomData = {
        title: this.title,
        numberOfTeams: this.numberOfTeams,
        quizTime: this.quizTime,
        password: this.password,
        quizId: this.selectedQuiz
      }

      roomDataService
        .create(roomData)
        .then((response) => {
          // Room created successfully
          if (response.status === 201)
            this.$router.push(`/room?roomId=${response.data.data.id}&password=${encodeURIComponent(this.password)}`);
          else
            console.log("Что то пошло не так при создании комнаты")
        })
        .catch(error => {
          if (error.status === 403) {
            console.log("Недостаточно прав для создания комнаты")
          }
          else
            console.error(error);
        });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../common_styles.less";
.room {
  &__input {
    min-width: 400px;
  }
  &__caption {
    font-size: 24px;
    color: @title2;
    padding-top: 20px;
  }
  &__select {
    font-size: 24px;
  }
  &__button {
    font-size: 32px;
  }
}
</style>