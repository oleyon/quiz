<template>
  <div>
    <div>
      <button @click="startQuiz()">
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