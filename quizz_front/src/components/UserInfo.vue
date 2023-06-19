<template>
  <div class="user_info">
    <div v-if="getUserInfo != null">
      <h2>Информация о пользователе</h2>
      <h3>
        Имя пользователя: 
        {{ getUserInfo?.username }}
      </h3>
      <h3>
        Имя: 
        {{ getUserInfo?.name }}
      </h3>
      <h3>
        Фамилия: 
        {{ getUserInfo?.surname }}
      </h3>
      <h3>
        Факультет: 
        {{ getUserInfo?.faculty }}
      </h3>
      <h3>
        Учетная запись: 
        {{ getUserInfo?.roles[0].substring(5) }}
      </h3>
    </div>
    <h3 v-else>
      <a href="login">Войдите</a>
       или 
      <a href="register">Зарегистрируйтесь</a>
      , чтобы увидеть информацию о пользователе.
    </h3>
  </div>
</template>

<script>
export default {
  computed: {
    getUserInfo() {
      return this.$store.getters['getUser']
    }
  },
  methods: {
  },
};
</script>

<style lang="less" scoped>
@import "../../common_styles.less";
.user_info {
  //height: fit-content;
  //width: fit-content;
  width: 30vw;
  padding: 40px;
  background: @div2;
  border-radius: 30px;
  margin: auto;
}
</style>