<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="login">
      <input type="text" v-model="username" placeholder="Username" required>
      <input type="password" v-model="password" placeholder="Password" required>
      <button type="submit">Login</button>
    </form>
    <div v-if="responseStatus === 'error'">
      <p>{{ errorMessage }}</p>
    </div>
    <div v-else-if="responseStatus === 'success'">
      <p>Login successful, redirecting...</p>
    </div>
  </div>
</template>

<script>
import userDataService from '../services/UserDataService';

export default {
  data() {
    return {
      username: '',
      password: '',
      responseStatus: '',
      errorMessage: ''
    };
  },
  methods: {
    login() {
      // Make an API call to your backend to authenticate the user and get the access token
      // Use axios or any other HTTP library of your choice
      // Send username and password to the backend

      // Example using axios
      //userDataService.test()
      userDataService.login({
        username: this.username,
        password: this.password
      })
      .then(response => {
        // Handle the response from the backend
        //const accessToken = response.data.accessToken;
        // Save the access token to local storage
        //localStorage.setItem('accessToken', accessToken);
        if (response.status === 200) {
            this.responseStatus = 'success';

            // Redirect to the homepage after a delay of 3 seconds
            setTimeout(() => {
              this.$store.commit('login')
              this.redirectToHomePage();
            }, 500);
          } else {
            this.responseStatus = 'error';
            this.errorMessage = response.data.message;
          }
      })
      .catch(error => {
        this.responseStatus = 'error';
        this.errorMessage = error.response.data.message;
        // Handle the error, e.g., show an error message
        console.log(error.response.data.message);
      });
    },
    redirectToHomePage() {
      this.$router.push('/');
    }
  }
};
</script>
