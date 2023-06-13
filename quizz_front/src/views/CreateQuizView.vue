<!-- CreateQuiz.vue -->

<template>
  <div>
    <h2>Create New Quiz</h2>
    <form @submit.prevent="createQuiz">
      <div>
        <label>Название:</label>
        <input type="text" v-model="title" required />
        <label>Описание:</label>
        <input type="text" v-model="description" required />
      </div>
      <div v-for="(question, index) in questions" :key="index">
        <h4>Question {{ index + 1 }}</h4>
        <input type="text" v-model="question.questionText" placeholder="Question" required />
        <input type="text" v-model="question.answers[0].answerText" placeholder="Answer 1" required />
        <input type="text" v-model="question.answers[1].answerText" placeholder="Answer 2" required />
        <input type="text" v-model="question.answers[2].answerText" placeholder="Answer 3" required />
        <input type="text" v-model="question.answers[3].answerText" placeholder="Answer 4" required />
        <label>Correct Answer:</label>
        <select v-model="question.correctAnswerIndex" required>
          <option value="0">Answer 1</option>
          <option value="1">Answer 2</option>
          <option value="2">Answer 3</option>
          <option value="3">Answer 4</option>
        </select>
      </div>
      <button type="button" @click="addQuestion">Add Question</button>
      <button type="submit">Create Quiz</button>
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
