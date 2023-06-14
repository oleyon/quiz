<template>
  <div>
    <div>
      <div>
        Ссылка на вход: {{ getJoinLink() }}
      </div>
      <div v-if="isUserCreator">
        <!-- <RoomCreatorFunctionality>

        </RoomCreatorFunctionality> -->
      </div>
      <QuizQuestion :question="currentQuestion" @answerSelected="selectAnswer">
        
      </QuizQuestion>
    </div>
    <div>
      <TeamInfo :teamUsers="getTeamInfo" @joinedTeam="joinTeam">

      </TeamInfo>
    </div>
  </div>
</template>

<script>
import roomDataService from '@/services/RoomDataService';
import TeamInfo from '../components/TeamInfo.vue';
import { mapGetters, mapActions } from 'vuex';
import QuizQuestion from '../components/QuizQuestion.vue'
import RoomDataService from '../services/RoomDataService';

export default {
  components: {
    TeamInfo,
    QuizQuestion
  },
  data() {
    return {
      roomInfo: {},
      currentQuestion: {}
    };
  },
  computed: {
    getTeamInfo() {
      return this.roomInfo;
    },
    isUserCreator() {
      return this.$store.state.user?.id == this.roomInfo.userId;
    }
  },
  created() {
    this.roomId = this.$route.query.roomId;
    this.password = this.$route.query.password;
    // Start retrieving room data
    roomDataService
      .joinRoom(this.roomId, this.password)
      .then(response => {
        this.getRoomData();
        this.getCurrentQuestion()
      }
      )
      .catch(error => {
        console.log(error);
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
      console.log(teamId)
      RoomDataService.joinTeam(teamId, this.roomId, this.password)
    },
    selectAnswer(answer) {
      RoomDataService.sendAnswer(answer, this.roomId, this.password)
    },
    async fetchRoomData() {
      // Make an API call to retrieve room data
      roomDataService
        .getRoomData(this.roomId, this.password)
        .then(response => {
          // Handle the response from the backend
          this.roomInfo = response.data;
          //console.log(this.roomInfo) // REMOVE
          this.updateTeams({teamUsers: this.roomInfo.room_users, teamsCount: this.roomInfo.numberOfTeams});
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
      })
      .catch(error => {
        console.log(error);
      });
    }
  }
};
</script>