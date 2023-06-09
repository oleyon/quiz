<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
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
            <RouterLink to="/register">Register</RouterLink>
            <RouterLink to="/login">Login</RouterLink>
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
