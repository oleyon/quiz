<template>
  <div class="teams">
    <div v-for="team in getTeams" :key="team.teamNumber">
      <h1 style="cursor: pointer;" @click="joinTeam(team.teamNumber)">Команда {{ team.teamNumber }}</h1>
      <ul>
        <li class="student-info" v-for="user in team.users" :key="user">{{ user.surname }} {{ user.name }} - {{ user.score }}</li>
      </ul>
      <h3>Итоговый счет: {{ team.totalScore }}</h3>
      <br>
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

<style lang="less" scoped>
.student-info {
  color: #729b6c;
  font-size: large;
  list-style: none;
}
.teams {
  overflow-y: scroll;
  height: 90%;
  margin-bottom: 10px;
}
</style>