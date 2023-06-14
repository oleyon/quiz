<template>
  <div>
    <h2>{{ question.questionText }}</h2>
    <div>
      <button v-for="answer in question.answers" :key="answer.id" @click="selectAnswer(answer.id)">
        {{ answer.answerText }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    question: {
      type: Object,
      required: true
    }
  },
  methods: {
    selectAnswer(answer) {
      this.$emit('answer-selected', answer);
    }
  }
};
</script>
