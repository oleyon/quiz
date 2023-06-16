<template>
  <div class="central">
    <h2>
      Ссылка на вход: {{ getJoinLink() }}
    </h2>
    <div class="horizontal">
      <div>
        <div class="main1 quiz-body">
          <div v-if="isUserCreator">
            <CreatorPanel v-if="!hasQuizStarted" @quizStarted="startQuiz"/>
          </div>
          <QuizQuestion v-if="!isUserCreator && !hasQuizFinished && hasQuizStarted" :question="currentQuestion" @answerSelected="selectAnswer"/>
          <h1 v-if="isOutOfQuestions && !hasQuizFinished && !isUserCreator">
            Вы ответили на все вопросы
          </h1>
          <h1 v-if="hasQuizFinished">Квиз окончен!</h1>
          <h2 v-if="hasQuizStarted">Осталось времени: {{ timeLeft }}</h2>
        </div>
      </div>
      <div class="main1 team-body">
        <TeamInfo :teamUsers="getTeamInfo" @joinedTeam="joinTeam"/>
        <button class="team-body__spectator-button" @click="joinSpectator" v-if="!hasQuizStarted">Стать наблюдателем</button>
      </div>
    </div>



  </div>
</template>

<script>
import roomDataService from '@/services/RoomDataService';
import TeamInfo from '../components/TeamInfo.vue';
import { mapGetters, mapActions } from 'vuex';
import QuizQuestion from '../components/QuizQuestion.vue'
import RoomDataService from '../services/RoomDataService';
import CreatorPanel from '../components/CreatorPanel.vue';

export default {
  components: {
    TeamInfo,
    QuizQuestion,
    CreatorPanel
  },
  data() {
    return {
      roomInfo: {},
      currentQuestion: {},
      isOutOfQuestionsV: false,
      timeLeft: 0
    };
  },
  computed: {
    getTeamInfo() {
      return this.roomInfo;
    },
    isUserCreator() {
      return this.$store.state.user?.id == this.roomInfo.userId;
    },
    hasQuizStarted() {
      return this.roomInfo?.startTime ?? false
    },
    hasQuizFinished() {
      return this.roomInfo?.isFinished ?? false
    },
    isOutOfQuestions() {
      return this.isOutOfQuestionsV
    }
  },
  async created() {
    this.roomId = this.$route.query.roomId;
    this.password = this.$route.query.password;
    roomDataService
      .joinRoom(this.roomId, this.password)
      .then(response => {
        this.getRoomData();
      }
      )
      .catch(error => {
        this.$router.push('/')
        // Handle error if necessary
      });
  },
  unmounted() {
    clearInterval(this.intervalId)
  },
  methods: {
    ...mapActions('team', ['updateTeams', 'updateNumberOfTeams']),
    async getRoomData() {
      // Retrieve room data initially
      this.fetchRoomData();

      // Retrieve room data every 2 seconds
      this.intervalId = setInterval(this.fetchRoomData, 2000);
    },
    isUserSpectator() {
      const username = this.$store.state.user?.username;
      const user = this.roomInfo.room_users.find(user => user.username == username);
      return user && user.teamNumber == 0;
    },
    joinTeam(teamId) {
      if(!this.isUserCreator)
        RoomDataService.joinTeam(teamId, this.roomId, this.password)
    },
    joinSpectator() {
      this.joinTeam(0);
    },
    startQuiz() {
      RoomDataService.startQuiz(this.roomId)
    },
    selectAnswer(answer) {
      RoomDataService.sendAnswer(answer, this.roomId, this.password)
      .then(response => {
        this.currentQuestion = response.data
        setTimeout(this.getCurrentQuestion, 1000)
        //this.getCurrentQuestion()
      })
    },
    fetchRoomData() {
      // Make an API call to retrieve room data
      roomDataService
        .getRoomData(this.roomId, this.password)
        .then(response => {
          // Handle the response from the backend
          this.roomInfo = response.data;
          //console.log(this.roomInfo) // REMOVE
          this.updateTeams({teamUsers: this.roomInfo.room_users, teamsCount: this.roomInfo.numberOfTeams});

          // Calculate and update timeLeft
          if (this.roomInfo.startTime) {
            const currentTime = new Date().getTime();
            const startTime = new Date(this.roomInfo.startTime).getTime();
            const quizTime = this.roomInfo.quizTime * 1000; // Convert seconds to milliseconds

            const elapsedTime = currentTime - startTime;
            const remainingTime = quizTime - elapsedTime;

            this.timeLeft = Math.max(0, Math.floor(remainingTime / 1000));
          } else {
            this.timeLeft = 0;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getJoinLink() {
      const fullPath = this.$route.fullPath;
      return `${window.location.origin}${fullPath}`;
    },
    getCurrentQuestion() {
      roomDataService.getCurrentQuestion(this.roomId, this.password)
      .then(response => {
        this.currentQuestion = response.data;
        if (this.currentQuestion == "") {
            this.isOutOfQuestionsV = true;
        }
      })
      .catch(error => {
        console.log(error);
      });
    }
  },
  watch: {
    hasQuizStarted(newVal) {
      if (newVal) {
        if(!this.isUserSpectator())
          this.getCurrentQuestion();
      }
    },
    hasQuizFinished(newVal) {
      if (newVal) {
        if(!this.isUserSpectator())
          this.getCurrentQuestion();
      }
    }
  }
};
</script>

<style lang="less" scoped>
.quiz-body {
  width: 70vw;
  height: 75vh;
}
.team-body {
  margin-left: 20px;
  margin-right: auto;
  &__spectator-button {
    font-size: xx-large;
  }
  height: 75vh;
}
</style>