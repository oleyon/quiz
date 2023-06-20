const state = {
  roomData: null
};

const getters = {
  getRoomData: (state) => state.roomData
};

const mutations = {
  setRoomData(state, roomData) {
    state.roomData = roomData;
    // Calculate total score for each team
    if (roomData && roomData.teams) {
      roomData.teams.forEach((team) => {
        let totalScore = 0;
        team.room_users.forEach((user) => {
          totalScore += user.score;
        });
        team.totalScore = totalScore;
      });
    }
  }
};

const actions = {
  setRoomData({ commit }, roomData) {
    commit('setRoomData', roomData);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
