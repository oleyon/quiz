<script>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
import UserDataService from './services/UserDataService';

export default {
  computed: {
    isAuthenticated() {
      return this.$store.state.isAuthenticated;
    },
    username() {
      return this.$store.state.user.username;
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
      // Perform any additional logout operations here
    },
  },
  created() {
    UserDataService.refreshToken()
      .then(response => {
          if (response.status === 200) {
            this.$store.dispatch('login');
            } else {
              this.$store.dispatch('logout');
            }
        })
        .catch(error => {
          this.$store.dispatch('logout');
        });
  }
};
</script>

<template>
  <div id="app">
    <header class="header">
      <div class="wrapper">
        <!-- <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" /> -->
        
        <nav>
          <div class="left-links">
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/about">About</RouterLink>
          </div>
          
          <div class="right-links">
            <div v-if="isAuthenticated">{{ username }}</div>
            <router-link v-if="isAuthenticated" @click="logout" to="#">Выйти</router-link>
            <router-link v-if="isAuthenticated" to="/createquiz">Создать квиз</router-link>
            <router-link v-if="!isAuthenticated" to="/register">Регистрация</router-link>
            <router-link v-if="!isAuthenticated" to="/login">Войти</router-link>
          </div>
        </nav>
      </div>
    </header>
  
    <main class="main">
      <RouterView />
    </main>

    <footer class="footer">
      <!-- Footer content goes here -->
    </footer>
  </div>
</template>

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  background-color: #f1f1f1;
  padding: 20px;
}

.wrapper {
  max-width: 960px;
  margin: 0 auto;
}

nav {
  display: flex;
  justify-content: space-between;
}

.left-links,
.right-links {
  display: flex;
  gap: 10px;
}

nav a {
  color: #333;
  text-decoration: none;
}

.main {
  flex-grow: 1;
  padding: 20px;
}

.footer {
  background-color: #f1f1f1;
  padding: 20px;
}
</style>
