<template>
  <div>
    <div>
      
    </div>
    <h2>Создать комнату</h2>
    <form @submit.prevent="createRoom">
      <div>
        <input type="text" v-model="title" placeholder="Название" required />
        <input type="number" v-model="numberOfTeams" placeholder="кол-во команд" required />
        <input type="number" v-model="quizTime" placeholder="Длительность квиза (с)" required />
        <input type="пароль" v-model="password" placeholder="Пароль (по желанию)"/>
      </div>
      <div>
        <select v-model="selectedQuiz">
          <option v-for="quiz in quizzes" :key="quiz.id" :value="quiz.id">{{ quiz.title }}</option>
        </select>
      </div>
      <button type="submit">Создать комнату</button>
    </form>
  </div>
</template>

<script>
import quizDataService from '@/services/QuizDataService';
import roomDataService from '@/services/RoomDataService';

export default {
  data() {
    return {
      
    };
  },
  methods: {

  }
};
</script>