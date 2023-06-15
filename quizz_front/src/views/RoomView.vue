<template>
  <div>
    <div>
      <div v-if="isUserCreator">
        <div>
          Ссылка на вход: {{ getJoinLink() }}
        </div>
        <CreatorPanel v-if="!hasQuizStarted" @quizStarted="startQuiz"/>
      </div>
      <div v-else>
        <QuizQuestion :question="currentQuestion" @answerSelected="selectAnswer"/>
        <div v-if="isOutOfQuestions">
          Вы ответили на все вопросы
        </div>
        <div v-if="hasQuizStarted">Осталось времени: {{ timeLeft }}</div>
      </div>
    </div>
    <div>
      <TeamInfo :teamUsers="getTeamInfo" @joinedTeam="joinTeam"/>
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
        //this.getCurrentQuestion() // TODO
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
    joinTeam(teamId) {
      RoomDataService.joinTeam(teamId, this.roomId, this.password)
    },
    startQuiz() {
      RoomDataService.startQuiz(this.roomId)
    },
    selectAnswer(answer) {
      RoomDataService.sendAnswer(answer, this.roomId, this.password)
      .then(response => {
        this.getCurrentQuestion()
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
        console.log(`current question = ${this.currentQuestion?.questionText}`)
      })
      .catch(error => {
        console.log(error);
      });
    }
  },
  watch: {
    hasQuizStarted(newVal) {
      if (newVal) {
        this.getCurrentQuestion();
      }
    }
  }
};
</script>