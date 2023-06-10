import { createStore } from 'vuex';
import userDataService from '../services/UserDataService';

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
  actions: {
    async logout({ commit }) {
      try {
        // Send request to invalidate tokens and clear cookies on the backend
        await userDataService.logout();
        // Clear authentication state
        commit('logout');
      } catch (error) {
        //console.log(error);
        // Handle error if necessary
      }
    },
    async login({ commit }) {
      userDataService.getUser()
      .then(response => {
        // Handle the response from the backend
        //const accessToken = response.data.accessToken;
        // Save the access token to local storage
        //localStorage.setItem('accessToken', accessToken);
        if (response.status === 200) {
          commit('login', response.data);
          } else {
            commit('logout')
          }
      })
      .catch(error => {
        commit('logout')
      });

      // try {
      //   // Retrieve user data from the backend
      //   const user = await userDataService.getUser();
      //   // Set user data in the store
      //   console.log("bruh")
      //   commit('login', user);
      // } catch (error) {
      //   console.log(error);
      //   // Handle error if necessary
      //   commit('logout');
      // }
    }
  }
});

export default store;