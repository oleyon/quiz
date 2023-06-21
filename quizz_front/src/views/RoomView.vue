<template>
  <div class="central">
    <h2 v-if="isUserCreator">
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
        <div class="buttons">
          <button class="team-body__spectator-button" v-if="!isEditing && !isUserCreator && !hasQuizStarted" @click="editTeamName">Изменить название</button>
          <input v-model="editName" v-if="isEditing" @blur="saveTeamName()" @keyup.enter="saveTeamName()"
        />
          <button class="team-body__spectator-button" @click="joinSpectator" v-if="!hasQuizStarted">Стать наблюдателем</button>
        </div>
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
      timeLeft: 0,
      isEditing: false,
      editName: ""
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
    ...mapActions('team', ['setRoomData']),
    editTeamName() {
      this.isEditing = true;
    },
    saveTeamName() {
      // TODO
      RoomDataService.setTeamName(this.editName, this.roomId, this.password);
      this.isEditing = false;
    },
    async getRoomData() {
      // Retrieve room data initially
      this.fetchRoomData();

      // Retrieve room data every 2 seconds
      this.intervalId = setInterval(this.fetchRoomData, 1000);
    },
    isUserSpectator() {
      const username = this.$store.state.user?.username;
      const roomInfo = this.roomInfo;
      const user = roomInfo.teams.reduce((foundUser, team) => {
        const userInTeam = team.room_users.find(user => user.user.username === username);
        if (userInTeam) {
          return userInTeam;
        }
        return foundUser;
      }, null);
      
      return user == null;
    },
    joinTeam(teamId) {
      if(!this.isUserCreator)
        RoomDataService.joinTeam(teamId, this.roomId, this.password)
    },
    joinSpectator() {
      this.joinTeam(null);
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
          this.setRoomData(this.roomInfo);

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
.buttons {
  display: flex;
  flex-direction: column;
  width: 400px;
  text-align: center;
  margin: auto;
}
</style>