<template>
  <div>
    <h2>Register</h2>
    <form @submit.prevent="register">
      <input type="text" v-model="username" placeholder="Username" required>
      <input type="email" v-model="email" placeholder="User email" required>
      <input type="password" v-model="password" placeholder="Password" required>
      <button type="submit">Register</button>
    </form>

    <!-- Conditional rendering based on response status -->
    <div v-if="responseStatus === 'error'">
      <p>{{ errorMessage }}</p>
    </div>
    <div v-else-if="responseStatus === 'success'">
      <p>Registration successful!</p>
    </div>
  </div>
</template>

<script>
import userDataService from '../services/UserDataService';

export default {
  data() {
    return {
      username: '',
      email: '',
      password: '',
      responseStatus: null,
      errorMessage: ''
    };
  },
  methods: {
    register() {
      userDataService.register({
        username: this.username,
        email: this.email,
        role: 0,
        password: this.password
      })
        .then(response => {
          if (response.status === 200) {
            this.responseStatus = 'success';

            // Redirect to the homepage after a delay of 3 seconds
            setTimeout(() => {
              this.redirectToHomePage();
            }, 3000);
          } else {
            this.responseStatus = 'error';
            this.errorMessage = response.data.message;
          }
        })
        .catch(error => {
          this.responseStatus = 'error';
          this.errorMessage = error.response.data.message;
        });
    },
    redirectToHomePage() {
      this.$router.push('/');
    }
  }
};
</script>
