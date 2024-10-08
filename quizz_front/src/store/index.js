import { createStore } from 'vuex';
import userDataService from '../services/UserDataService';
import team from './teams';

const store = createStore({
  state: {
    isAuthenticated: false,
    user: null
  },
  mutations: {
    login(state, user) {
      state.isAuthenticated = true;
      state.user = user;

    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
    }
  },
  getters: {
    getUser: (state) => state.user,
    isAuthenticated: (state) => state.isAuthenticated
  },
  actions: {
    async logout({ commit }) {
      try {
        // Send request to invalidate tokens and clear cookies on the backend
        await userDataService.logout();
        // Clear authentication state
        commit('logout');
      } catch (error) {
      }
    },
    async login({ commit }) {
      try {
        const response = await userDataService.getUser();
        if (response.status === 200) {
          commit('login', response.data);
        } else {
          commit('logout');
        }
      } catch (error) {
        commit('logout');
      }
    }
  },
  modules: {
    team
  }
});

export default store;