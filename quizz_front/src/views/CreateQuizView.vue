<template>
  <div class="central main1" style="height: 84vh;">
    <form @submit.prevent="createQuiz">
      <div class="level2"
      style="height: 10vh">
        <h2>Создать новый квиз</h2>
        <div>
          <label style="margin-right: 10px;">Название:</label>
          <input style="margin-right: 10px;" type="text" v-model="title" required />
          <label style="margin-right: 10px;" >Описание:</label>
          <input type="text" v-model="description" required />
        </div>
      </div>
    <div class="central level2"
    style="height: 65vh; overflow-y: scroll; padding: 10px 0px"
    >

        <div
          v-for="(question, index) in questions"
          :key="index"
          class="quiz__question-area level3"
        >
          <h1>Вопрос {{ index + 1 }}</h1>
          <input type="text" v-model="question.questionText" placeholder="Вопрос" required class="quiz__question" />
          <br>
          <input class="quiz__answer" type="text" v-model="question.answers[0].answerText" placeholder="Ответ 1" required />
          <input class="quiz__answer" type="text" v-model="question.answers[1].answerText" placeholder="Ответ 2" required />
          <input class="quiz__answer" type="text" v-model="question.answers[2].answerText" placeholder="Ответ 3" required />
          <input class="quiz__answer" type="text" v-model="question.answers[3].answerText" placeholder="Ответ 4" required />
          <br>
          <div class="quiz__answer-field">
            <label class="quiz__label">Правильный ответ:</label>
            <select v-model="question.correctAnswerIndex" required>
              <option value="0">Ответ 1</option>
              <option value="1">Ответ 2</option>
              <option value="2">Ответ 3</option>
              <option value="3">Ответ 4</option>
            </select>
          </div>
        </div>
    </div>
  </form>

    <div class= "central level1"
    style="margin-top: 0.5vh">
      <button class="quiz__button" type="button" @click="addQuestion">Добавить вопрос</button>
      <button class="quiz__button" type="submit">Создать квиз</button>
    </div>
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
@import "../../common_styles.less";

.quiz{
  &__question-area {
    background: @div2;
    border-radius: 18px;
    width: 80%;
    margin-left: 10%;
    margin-bottom: 10px;
    padding: 1px 0px 13px 0px;
    min-height: fit-content;
  }

  &__question {
    width: 35%;
    min-height: 50px;
    overflow: scroll;
    margin-bottom: 10px;
  }

  &__answer {
    margin: 0px 5px;
  }

  &__button {
    width: 170px;
    height: 30px;
    background-color: @button1bg;
    color: @text1;
    border: solid 2px @div1;
    border-radius: 8px;
    margin: 2px 7px 2px 7px;
    &:hover {
      background-color: @div3;
    }
  }

  &__answer-field {
    margin-top: 10px;
  }

  &__label {
  font-size: 18px;
  font-size: @text1_size;
  padding: 0px 5px;
  }
}



</style>