<template>
  <div class="modal" @click="closeModal">
    <div class="modal__content" @click.stop>
      <h2>Введите пароль</h2>
      <input type="password" v-model="password" placeholder="Password" />
      <button class="modal__button" @click="submitPassword">Submit</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      password: ''
    };
  },
  methods: {
    submitPassword() {
      this.$emit('passwordEntered', this.password);
      this.closeModal();
    },
    closeModal() {
      this.$emit('close');
    }
  }
};
</script>

<style lang="less" scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  &__content {
    background-color: #00000090;
    padding: 20px;
    border-radius: 20px;
  }
  &__button {
    width: 100px;
    height: 40px;
  }
}

.modal-content {
  background-color: #00000090;
  padding: 20px;
  border-radius: 4px;
}
</style>
