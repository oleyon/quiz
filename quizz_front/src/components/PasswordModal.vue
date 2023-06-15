<template>
  <div class="modal" @click="closeModal">
    <div class="modal-content" @click.stop>
      <h2>Enter Password</h2>
      <input type="password" v-model="password" placeholder="Password" />
      <button @click="submitPassword">Submit</button>
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

<style scoped>
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
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 4px;
}
</style>
