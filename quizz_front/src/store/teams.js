const state = {
  teams: [],
  numberOfTeams: 0
};

const getters = {
  getTeams: (state) => state.teams,
  getNumberOfTeams: (state) => state.numberOfTeams,
};

const mutations = {
  setTeams: (state, teams) => {
    state.teams = teams;
  },
  setNumberOfTeams: (state, numberOfTeams) => {
    state.numberOfTeams = numberOfTeams;
  }
};

const actions = {
  updateTeams: ({ commit }, { teamUsers, teamsCount }) => {
    let teams = [];
  
    for (let i = 0; i < teamsCount; i++) {
      let team = {
        teamNumber: i + 1,
        users: [],
        totalScore: 0,
      };
      teams.push(team);
    }
    teamUsers.forEach((teamUser) => {
      const { score, teamNumber, user } = teamUser;
      const { username, surname, name } = user;
      if(teamNumber>0) {
        let team = teams.find((t) => t.teamNumber === teamNumber);
        if (!team) {
          team = {
            teamNumber,
            users: [],
            totalScore: 0,
          };
          teams.push(team);
        }
    
        team.users.push({ name, surname, username, score });
        team.totalScore += score;
      }
    });

    commit('setTeams', teams);
  }
  
  
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
