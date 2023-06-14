<!-- <template>
  <div>
    <div v-for="team in teams" :key="team.id">
      <h3>Team {{ team.id }}</h3>
      <ul>
        <li v-for="user in getUsersByTeam(team.id)" :key="user.id">
          {{ user.username }} - Score: {{ user.score }}
        </li>
      </ul>
      <p>Total Score: {{ getTeamTotalScore(team.id) }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    teamUsers: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      teams: [],
      joinedTeamId: null
    };
  },
  computed: {
    teamUsers1() {
      return this.teamUsers.room_users
    }
  },
  created() {
    this.createTeams();
  },
  methods: {
    createTeams() {
      // Get unique team numbers from the teamUsers array
      const uniqueTeams = [...new Set(this.teamUsers1.map(user => user.teamNumber))];

      // Create a team object for each unique team number
      this.teams = uniqueTeams.map(teamNumber => ({
        id: teamNumber,
        users: []
      }));

      // Assign users to their respective teams
      this.teamUsers1.forEach(user => {
        const team = this.teams.find(team => team.id === user.teamNumber);
        if (team) {
          team.users.push(user);
        }
      });
    },
    getUsersByTeam(teamId) {
      const team = this.teams.find(team => team.id === teamId);
      return team ? team.users : [];
    },
    getTeamTotalScore(teamId) {
      const users = this.getUsersByTeam(teamId);
      return users.reduce((total, user) => total + user.score, 0);
    }
  }
};
</script> -->
<template>
  <div>
    <div v-for="team in getTeams" :key="team.teamNumber">
      <h3 @click="joinTeam(team.teamNumber)">Команда {{ team.teamNumber }}</h3>
      <ul>
        <li v-for="user in team.users" :key="user">{{ user.username }} - {{ user.score }}</li>
      </ul>
      <p>Итоговый счет: {{ team.totalScore }}</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('team', ['getTeams']),
  },
  methods: {
    joinTeam(teamId) {
      this.$emit('joined-team', teamId);
    }
  },
};
</script>
