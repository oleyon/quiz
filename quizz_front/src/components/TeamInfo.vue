<template>
  <div class="teams">
    <div v-for="team in getRoomData?.teams" :key="team.teamId">
      <h1 style="cursor: pointer;" @dblclick="toggleEditTeamName(team)"
        v-if="!team.editable" @click="joinTeam(team.id)">{{ team.name }}</h1>
        <input
          v-model="team.name"
          v-if="team.editable"
          @blur="saveTeamName(team)"
          @keyup.enter="saveTeamName(team)"
        />
      <ul>
        <li class="student-info" v-for="user in team.room_users" :key="user">{{ user.user.surname }} {{ user.user.name }} - {{ user.score }}</li>
      </ul>
      <h3>Итоговый счет: {{ team.totalScore }}</h3>
      <br>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import RoomDataService from '../services/RoomDataService';

export default {
  computed: {
    ...mapGetters('team', ['getRoomData']),
  },
  methods: {
    joinTeam(teamId) {
      this.$emit('joined-team', teamId);
    },
    toggleEditTeamName(team) {
      team.editable = true;
    },
    saveTeamName(team) {
      team.editable = false;
      RoomDataService.saveTeamName(team.id, team.name, this.getRoomData.id, this.getRoomData.password)
    }
  },
};
</script>

<style lang="less" scoped>
.student-info {
  color: #e3c70e;
  font-size: x-large;
  list-style: none;
}
.teams {
  overflow-y: scroll;
  height: 85%;
  margin-bottom: 10px;
}
</style>