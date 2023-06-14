<template>
  <div>
    <h2>Создать новый квиз</h2>
    <form @submit.prevent="createQuiz">
      <div>
        <label>Название:</label>
        <input type="text" v-model="title" required />
        <label>Описание:</label>
        <input type="text" v-model="description" required />
      </div>
      <div v-for="(question, index) in questions" :key="index">
        <h4>Вопрос {{ index + 1 }}</h4>
        <input type="text" v-model="question.questionText" placeholder="Question" required />
        <input type="text" v-model="question.answers[0].answerText" placeholder="Answer 1" required />
        <input type="text" v-model="question.answers[1].answerText" placeholder="Answer 2" required />
        <input type="text" v-model="question.answers[2].answerText" placeholder="Answer 3" required />
        <input type="text" v-model="question.answers[3].answerText" placeholder="Answer 4" required />
        <label>Привальный ответ:</label>
        <select v-model="question.correctAnswerIndex" required>
          <option value="0">Ответ 1</option>
          <option value="1">Ответ 2</option>
          <option value="2">Ответ 3</option>
          <option value="3">Ответ 4</option>
        </select>
      </div>
      <button type="button" @click="addQuestion">Добавить вопрос</button>
      <button type="submit">Создать квиз</button>
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
