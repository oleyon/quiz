<template>
  <div class="main1 central login">
    <h1>Вход</h1>
    <form @submit.prevent="performLogin">
      <input type="text" v-model="username" placeholder="Имя пользователя" required>
      <input type="password" v-model="password" placeholder="Пароль" required>
      <button type="submit">Войти</button>
    </form>
    <div v-if="responseStatus === 'error'">
      <p>{{ errorMessage }}</p>
    </div>
    <div v-else-if="responseStatus === 'success'">
      <h2>Успешный вход. Возврат на главную...</h2>
    </div>
  </div>
</template>

<script>
import userDataService from '../services/UserDataService';
import { mapActions } from 'vuex';

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
    ...mapActions(['login']),
    performLogin() {
      userDataService.login({
        username: this.username,
        password: this.password
      })
      .then(response => {
        if (response.status == 200) {
            this.responseStatus = 'success';
            // Redirect to the homepage after a delay of 0.5 seconds
            setTimeout(() => {
              this.login();
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

<style lang="less" scoped>
.login {
  height: fit-content;
  width: fit-content;
  padding: 40px;
}
</style>