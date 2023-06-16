<template>
  <div class="question" v-if="question!=={}">
    <h1 class="question__text">{{ question.questionText }}</h1>
    <div>
      <button class="question__button" v-for="answer in question.answers" :key="answer.id" @click="selectAnswer(answer.id)" :class="getAnswerButtonClass(answer.isCorrect)">
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
    },
    getAnswerButtonClass(isCorrect) {
      if (isCorrect === true) {
        return 'question__button--correct';
      } else if (isCorrect === false) {
        return 'question__button--incorrect';
      } else {
        return '';
      }
    }
  }
};
</script>

<style lang="less" scoped>
.question {
  height: 85%;
  overflow-y: scroll;
  &__button {
    width: 400px;
    height: 200px;
    margin: 40px;
    font-size: xx-large;
  }
  &__button--correct {
    background-color: green;
  }

  &__button--incorrect {
    background-color: red;
  }
}
</style>