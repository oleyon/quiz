<template>
  <div>
    <h2>Register</h2>
    <form @submit.prevent="register">
      <input type="text" v-model="username" placeholder="Логин" required>
      <input type="text" v-model="name" placeholder="Имя" required>
      <input type="text" v-model="surname" placeholder="Фамилия" required>
      <input type="text" v-model="faculty" placeholder="Факультет" required>
      <input type="email" v-model="email" placeholder="Почта" required>
      <input type="password" v-model="password" placeholder="Пароль" required>
      <button type="submit">Register</button>
    </form>

    <!-- Conditional rendering based on response status -->
    <div v-if="responseStatus === 'error'">
      <p>{{ errorMessage }}</p>
    </div>
    <div v-else-if="responseStatus === 'success'">
      <p>Успешная регистрация!</p>
    </div>
  </div>
</template>

<script>
import userDataService from '../services/UserDataService';

export default {
  data() {
    return {
      username: '',
      name: '',
      surname: '',
      faculty: '',
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
        name: this.name,
        surname: this.surname,
        faculty: this.faculty,
        password: this.password
      })
        .then(response => {
          if (response.status === 200) {
            this.responseStatus = 'success';

            setTimeout(() => {
              this.redirectToHomePage();
            }, 1000);
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
