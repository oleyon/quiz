<template>
  <div class="quiz">
    <h2>Создать новый квиз</h2>
    <form @submit.prevent="createQuiz">
      <div>
        <label>Название:</label>
        <input type="text" v-model="title" required />
        <label>Описание:</label>
        <input type="text" v-model="description" required />
      </div>
      <div
        v-for="(question, index) in questions"
        :key="index"
        class="quiz__room"
      >
        <h4 class="quiz__question__title">Вопрос {{ index + 1 }}</h4>
        <input type="text" v-model="question.questionText" placeholder="Вопрос" required class="quiz__question" />
        <br>
        <input type="text" v-model="question.answers[0].answerText" placeholder="Ответ 1" required />
        <input type="text" v-model="question.answers[1].answerText" placeholder="Ответ 2" required />
        <input type="text" v-model="question.answers[2].answerText" placeholder="Ответ 3" required />
        <input type="text" v-model="question.answers[3].answerText" placeholder="Ответ 4" required />
        <br>
        <div class="quiz__answer-field">
          <label>Правильный ответ:</label>
          <select v-model="question.correctAnswerIndex" required>
            <option value="0">Ответ 1</option>
            <option value="1">Ответ 2</option>
            <option value="2">Ответ 3</option>
            <option value="3">Ответ 4</option>
          </select>
        </div>
      </div>
      <button class="quiz__button" type="button" @click="addQuestion">Добавить вопрос</button>
      <button class="quiz__button" type="submit">Создать квиз</button>
    </form>
  </div>
</template>

<script>
import QuizDataService from '@/services/QuizDataService';

export default {
  data() {
    return {
      title: '',
      description: '',
      questions: [
        {
          questionText: '',
          answers: [
            { answerText: '', isCorrect: false },
            { answerText: '', isCorrect: false },
            { answerText: '', isCorrect: false },
            { answerText: '', isCorrect: false }
          ],
          correctAnswerIndex: 0
        }
      ]
    };
  },
  methods: {
    addQuestion() {
      this.questions.push({
        questionText: '',
        answers: [
          { answerText: '', isCorrect: false },
          { answerText: '', isCorrect: false },
          { answerText: '', isCorrect: false },
          { answerText: '', isCorrect: false }
        ],
        correctAnswerIndex: 0
      });
    },
    createQuiz() {
      const quizData = {
        title: this.title,
        description: this.description,
        questions: this.questions.map(question => ({
          questionText: question.questionText,
          answers: question.answers.map((answer, index) => ({
            answerText: answer.answerText,
            isCorrect: index == question.correctAnswerIndex,
          }))
        }))
      };

      QuizDataService.create(quizData)
        .then((response) => {
          // Quiz created successfully
          if (response.status === 201)
            this.$router.push('/'); // Redirect to main page
          else
            console.log("Что то пошло не так при создании квиза")
        })
        .catch(error => {
          if (error.status === 403) {
            console.log("Недостаточно прав для создания квиза")
          }
          else
            console.error(error);
        });
    }
  }
};
</script>

<style lang="less" scoped>
@import "../../themevars.less";
.quiz{
  align-content: center;
  text-align: center;

  background: @d1;
  color: @t1;
  border-radius: 30px;
  width: 90vw;
  height: 84vh;
  max-height: 70%;
  overflow-y: scroll;
  //margin-left: 5%;
  margin: auto;
  padding-bottom: 10px;

  &__room {
    align-content: center;
    text-align: center;
    margin-left: 10%;

    background: @d2;
    color: @t2;
    width: 80%;
    min-height: fit-content;
    border-radius: 15px;
    margin-bottom: 10px;
    padding-bottom: 10px;
  }
  &__question {
    width: 30%;
    height: 50px;
    margin-bottom: 10px;
    //rewrite to normal names
    &__title{
      padding-top: 10px;
      color: @t1;
    }
    &__cringe{
      color:black;
    }
  }
  &__button {
    width: 150px;
    height: 30px;
    background-color: @d2;
    color: @t1;
    border: solid 2px @d1;
    border-radius: 8px;
    margin: 2px 7px 2px 7px;
  }
  &__answer-field {
    margin-top: 10px;
    color: @t3;
    label {
      color: @t1;
    }
  }

}
label {
  padding: 0px 5px;
}
input {
  padding: 2px 10px;
  border-radius: 10px;
  min-height: 22px;
  border: 2px solid #2e2d2d2f;
  font-size: 15px;
  color: @t3;
  background: @d3
}
select {
  border-radius: 5px;
  min-height: 25px;
  padding: 5px;
  background: @d3;
}
</style>