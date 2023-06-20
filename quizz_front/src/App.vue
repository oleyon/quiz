<template>
  <header class="header">
    <div class="wrapper">
      <nav>
        <div class="left-links">
          <RouterLink class="router-link" to="/">Главная</RouterLink>
          <RouterLink class="router-link" to="/about">О сайте</RouterLink>
        </div>
        
        <div class="right-links">
          <div class="header__username" v-if="isAuthenticated">{{ username }}</div>
          <div v-if="role == 'ROLE_ПРЕПОДАВАТЕЛЬ'">
            <router-link class="router-link" v-if="isAuthenticated" to="/createquiz">Создать квиз</router-link>
            <router-link class="router-link" v-if="isAuthenticated" to="/room/create">Создать комнату</router-link>
          </div>
          <router-link class="router-link" v-if="isAuthenticated" @click="logout" to="#">Выйти</router-link>
          <router-link class="router-link" v-if="!isAuthenticated" to="/register">Регистрация</router-link>
          <router-link class="router-link" v-if="!isAuthenticated" to="/login">Войти</router-link>
        </div>
      </nav>
    </div>
  </header>

  <main class="main">
    <RouterView />
  </main>

  <footer class="footer">
  </footer>
</template>

<script>
import { RouterLink, RouterView } from 'vue-router'
import UserDataService from './services/UserDataService';

export default {
  computed: {
    isAuthenticated() {
      return this.$store.state.isAuthenticated;
    },
    username() {
      return this.$store.state.user?.username;
    },
    role() {
      return this.$store.state.user?.roles[0]
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
      // Perform any additional logout operations here
    },
  },
  mounted() {
    UserDataService.refreshToken()
    .then(response => {
        if (response.status == 200) {
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


<style lang="less">
@import "../common_styles.less";
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.router-link{
  font-size: 20px;
  padding-left: 20px;
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
  color: @text1;
  text-decoration: none;
}

.main {
  flex-grow: 1;
  padding: 20px;
  background: @bg1;
}
.header__username {
  font: 26px bold;
  font-weight: bold;
  text-decoration: underline;
  color: @accent1;
  font-stretch: narrower;
  margin-top: -5px;
}
.header{
    background: @bg2;
    color: @text1;
    padding: 20px;
  }
  .wrapper {
    max-width: 960px;
    margin: 0 auto;
  }
  
.footer {
    background: @bg2;
    padding: 20px;
  }


*::-webkit-scrollbar {
  
  //scroll-margin: 20px 10px;
  background: @scroll;
  width: 12px;
  border-radius: 10px;
  scrollbar-width: none;
}

*::-webkit-scrollbar-track {
  width: 20px;
  background: @scroll-track;
  border-radius: 5px;
  //background: @bg1;
  scrollbar-width: none;
}

*::-webkit-scrollbar-thumb {
  width: 20px;
  padding-right: 10px;
  background: @scroll-caret;
  border: 1px transparent #2f2b3107;
  border-radius: 10px;
}
</style>