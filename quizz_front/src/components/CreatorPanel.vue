<template>
  <div>
    <div>
      <button class="creator-button" @click="startQuiz()">
        Начать квиз
      </button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    startQuiz(answer) {
      this.$emit('quiz-started', answer);
    }
  }
};
</script>

<style lang="less">
.creator-button {
  font-size: 50px;
  margin-top: 10px;
}
</style>